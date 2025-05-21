using System.IO.Ports;
using System.Text;
using Gui.Core.CommandAggregate;
using Gui.Core.Domain.Telemetry;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Hosting;

namespace Gui.Infrastructure.Serial;

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
          //  Console.WriteLine($"[CSV] LOGGING: CAN={canId} Payload={BitConverter.ToString(payload)} TS={mcuTimestamp}");
          //  Console.WriteLine($"[CSV] Using file: {Path.GetFullPath(FileName)}");
            if (!File.Exists(FileName))
            {
                await File.WriteAllTextAsync(
                    FileName,
                    "CanId,B0,B1,B2,B3,B4,B5,B6,B7,LoggedAtUtc,McuTimestamp\n",
                    Encoding.UTF8);
            }

            string hex = string.Join(",", payload.Select(b => b.ToString("X2")));
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
    private readonly string _com = "COM6";
    private readonly int _baud = 115200;
    private readonly IServiceScopeFactory _scopeFactory;

    private SerialPort? _sp;
    private readonly SemaphoreSlim _initLock = new(1, 1);
    private readonly SemaphoreSlim _txLock = new(1, 1);

    public SerialPortService(IServiceScopeFactory scopeFactory)
    {
        _scopeFactory = scopeFactory;
    }

    private void EnsurePortOpen()
    {
        _initLock.Wait();
        try
        {
            if (_sp == null)
            {
                _sp = new SerialPort(_com, _baud)
                {
                    DtrEnable = true,
                    Encoding = Encoding.ASCII
                };
                _sp.DataReceived += OnData;
            }

                if (_sp.IsOpen)
                {
                    //Console.WriteLine($"[Serial] Port {_com} is already open.");
                    return;
                }

            Console.WriteLine($"[Serial] Opening port {_com}...");
            _sp.Open();
            Console.WriteLine($"[Serial] {_com} opened (baud {_baud}).");
        }
        finally
        {
            _initLock.Release();
        }
    }



    private readonly StringBuilder _serialBuffer = new();

    private void OnData(object? sender, SerialDataReceivedEventArgs e)
    {
        try
        {
            string incoming = _sp!.ReadExisting();
          //  Console.WriteLine($"[SERIAL] Raw incoming: '{incoming.Replace("\n", "\\n").Replace("\r", "\\r")}'");
            _serialBuffer.Append(incoming);

            while (true)
            {
                string buffer = _serialBuffer.ToString();
                int newlineIndex = buffer.IndexOfAny(new[] { '\n', '\r' });

                if (newlineIndex == -1)
                    break;

                string line = buffer.Substring(0, newlineIndex).Trim();
                _serialBuffer.Remove(0, newlineIndex + 1);

                if (!string.IsNullOrWhiteSpace(line))
                {
                //    Console.WriteLine($"[SERIAL] Complete line: '{line}'");
                    _ = ProcessLineAsync(line);
                }
            }

            // Handle final line if there's no newline but it looks complete
            if (_serialBuffer.Length > 0)
            {
                string maybeLine = _serialBuffer.ToString().Trim();
                var parts = maybeLine.Split(',');
                if (parts.Length >= 9)
                {
                 //   Console.WriteLine($"[SERIAL] Flushing incomplete line as full: '{maybeLine}'");
                    _serialBuffer.Clear();
                    _ = ProcessLineAsync(maybeLine);
                }
            }
        }
        catch (Exception ex)
        {
            Console.WriteLine($"[RX] Error in OnData: {ex.Message}");
        }
    }



        private async Task ProcessLineAsync(string trimmed)
        {
          //  Console.WriteLine($"[RX] {trimmed}");

        var parts = trimmed.Split(',');

        if (parts.Length < 9 || parts.Length > 10)
        {
            Console.WriteLine($"[RX] Skipped: expected 9 or 10 fields, got {parts.Length}");
            return;
        }

        if (!int.TryParse(parts[0], out var canId))
        {
            Console.WriteLine($"[RX] Skipped: invalid CAN ID '{parts[0]}'");
            return;
        }

        var bytes = new byte[8];
        for (int i = 0; i < 8; i++)
        {
            if (!byte.TryParse(parts[i + 1], System.Globalization.NumberStyles.HexNumber, null, out bytes[i]))
            {
                Console.WriteLine($"[RX] Skipped: invalid byte at B{i}: '{parts[i + 1]}'");
                return;
            }
        }

        string timestamp = (parts.Length == 10) ? parts[9].Trim() : DateTime.UtcNow.ToString("o");

        var parsedTimestamp = DateTime.TryParse(timestamp, out var parsedDateTime)
            ? parsedDateTime
            : DateTime.UtcNow;

       // Console.WriteLine($"[RX] Final parsed: CAN ID={canId}, Bytes={BitConverter.ToString(bytes)}, Timestamp={parsedTimestamp:o}");
        using var scope = _scopeFactory.CreateScope();
        var canService = scope.ServiceProvider.GetRequiredService<CanService>();
     //   Console.WriteLine($"[DEBUG] Passing CAN {canId} to CanService, Bytes={BitConverter.ToString(bytes)}, Timestamp={parsedTimestamp:o}");
        await canService.ProcessCanMessageAsync(canId, bytes, parsedTimestamp);
        await CsvLogger.AppendAsync(canId, bytes, timestamp);
      //  Console.WriteLine($"[DEBUG] Logged CAN {canId} to CSV");
    }

    public async Task SendAsync(Command cmd)
    {
        EnsurePortOpen();

            await _txLock.WaitAsync();
            try
            {
                var msg = cmd.ToMessage();
                _sp!.Write(msg, 0, msg.Length);
              //  Console.WriteLine($"[TX] {Encoding.ASCII.GetString(msg).Trim()}");

            byte[] payloadBytes = BitConverter.GetBytes(cmd.Payload);
            Array.Reverse(payloadBytes);
            await CsvLogger.AppendAsync(cmd.CanId, payloadBytes);
        }
        finally { _txLock.Release(); }
    }

    protected override Task ExecuteAsync(CancellationToken stoppingToken)
    {
        EnsurePortOpen();

        return Task.Run(async () =>
        {
            while (!stoppingToken.IsCancellationRequested)
            {
                await Task.Delay(1000, stoppingToken);
            }
        }, stoppingToken);
    }

    public override void Dispose()
    {
        Console.WriteLine("Port is closing");
        _sp?.Close();
        _sp?.Dispose();
        base.Dispose();
    }
}