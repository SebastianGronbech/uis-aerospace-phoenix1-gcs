using System.IO.Ports;
using System.Text;
using Gui.Core.CommandAggregate;
using Microsoft.Extensions.Hosting;

namespace Gui.Infrastructure.Serial
{
    // ───────────────────────────────────────── CSV Logger ─────────────────────────────────────────
    internal static class CsvLogger
    {
        private const string FileName = "can‑rx.csv";
        private static readonly SemaphoreSlim Gate = new(1, 1);

        public static async Task AppendAsync(int canId, byte[] payload, string? mcuTimestamp = null)
        {
            await Gate.WaitAsync();
            try
            {
                if (!File.Exists(FileName))
                {
                    await File.WriteAllTextAsync(
                        FileName,
                        "CanId,B0,B1,B2,B3,B4,B5,B6,B7,LoggedAtUtc,McuTimestamp\n",
                        Encoding.UTF8);
                }

                string hex = string.Join(",", payload.ToArray().Select(b => b.ToString("X2")));
                string now = DateTime.UtcNow.ToString("o");
                string ts = mcuTimestamp ?? "";

                string row = $"{canId},{hex},{now},{ts}\n";
                await File.AppendAllTextAsync(FileName, row, Encoding.UTF8);
            }
            finally { Gate.Release(); }
        }
    }



    // ──────────────────────────────────────── Serial Service ───────────────────────────────────────
    /// <summary>
    /// Opens the serial port on demand, listens forever, and sends commands immediately.
    /// </summary>
    public sealed class SerialPortService : BackgroundService, IPortSender
    {
        private readonly string _com = "COM4";
        private readonly int _baud = 115200;

        private SerialPort? _sp;
        private readonly SemaphoreSlim _initLock = new(1, 1);  // one‑time init
        private readonly SemaphoreSlim _txLock = new(1, 1);  // serialise writes

        // 1️⃣ Ensure port is open; idempotent & thread‑safe
        private void EnsurePortOpen()
        {
            if (_sp is { IsOpen: true }) return;      // already good

            _initLock.Wait();
            try
            {
                if (_sp is { IsOpen: true }) return;  // double‑checked

                _sp ??= new SerialPort(_com, _baud)
                {
                    DtrEnable = true,
                    Encoding = Encoding.ASCII
                };
                _sp.DataReceived -= OnData;           // avoid dupes
                _sp.DataReceived += OnData;
                _sp.Open();
                Console.WriteLine($"[Serial] {_com} opened (baud {_baud}).");
            }
            finally { _initLock.Release(); }
        }

        // 2️⃣ RX path → CSV
        private async void OnData(object? s, SerialDataReceivedEventArgs e)
        {
            try
            {
                string raw = _sp!.ReadLine(); // just read whatever is in buffer
                if (string.IsNullOrWhiteSpace(raw)) return;

                foreach (var line in raw.Split(new[] { '\r', '\n' }, StringSplitOptions.RemoveEmptyEntries))
                {
                    string trimmed = line.Trim();
                    Console.WriteLine($"[RX] {trimmed}");

                    var parts = trimmed.Split(',');

                    if (parts.Length < 9 || parts.Length > 10)
                    {
                        Console.WriteLine($"[RX] Skipped: expected 9 or 10 fields, got {parts.Length}");
                        continue;
                    }

                    if (!int.TryParse(parts[0], out var canId))
                    {
                        Console.WriteLine($"[RX] Skipped: invalid CAN ID '{parts[0]}'");
                        continue;
                    }

                    var bytes = new byte[8];
                    bool valid = true;

                    for (int i = 0; i < 8; i++)
                    {
                        if (!byte.TryParse(parts[i + 1], System.Globalization.NumberStyles.HexNumber, null, out bytes[i]))
                        {
                            Console.WriteLine($"[RX] Skipped: invalid byte at B{i}: '{parts[i + 1]}'");
                            valid = false;
                            break;
                        }
                    }

                    if (!valid) continue;

                    // 🆕 Optional: extract timestamp from MCU, fallback to now
                    string timestamp = (parts.Length == 10) ? parts[9].Trim() : DateTime.UtcNow.ToString("o");

                    await CsvLogger.AppendAsync(canId, bytes, timestamp);
                }

            }
            catch (Exception ex)
            {
                Console.WriteLine($"[RX] Error: {ex.Message}");
            }
        }


        // 3️⃣ TX path (zero‑wait, highest priority)
        public async Task SendAsync(Command cmd)
        {
            EnsurePortOpen();                       // opens instantly if needed

            await _txLock.WaitAsync();              // prevent interleaved writes
            try
            {
                var msg = cmd.ToMessage();
                _sp!.Write(msg, 0, msg.Length);
                Console.WriteLine($"[TX] {Encoding.ASCII.GetString(msg).Trim()}");

                // ✅ Log to CS
                byte[] payloadBytes = BitConverter.GetBytes(cmd.Payload);
                Array.Reverse(payloadBytes); // Ensure big-endian if needed
                await CsvLogger.AppendAsync(cmd.CanId, payloadBytes);
            }
            finally { _txLock.Release(); }
        }

        // 4️⃣ BackgroundService keeps the process alive but does nothing else
        protected override Task ExecuteAsync(CancellationToken _) => Task.CompletedTask;

        public override void Dispose()
        {
            _sp?.Close();
            _sp?.Dispose();
            base.Dispose();
        }
    }
}
