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
public sealed class SerialPortService : BackgroundService, IPortSender
{
    private readonly string _com = "COM4";
    private readonly int _baud = 115200;
    private readonly IServiceScopeFactory _scopeFactory;

    private SerialPort? _sp;
    private readonly SemaphoreSlim _initLock = new(1, 1);
    private readonly SemaphoreSlim _txLock = new(1, 1);
    private readonly StringBuilder _serialBuffer = new();
    private DateTime _lastRx = DateTime.UtcNow;

    public SerialPortService(IServiceScopeFactory scopeFactory)
    {
        _scopeFactory = scopeFactory;
    }

    private void EnsurePortOpen()
    {
        _initLock.Wait();
        try
        {
            if (_sp == null || !_sp.IsOpen)
            {
                _sp?.Dispose();
                _sp = new SerialPort(_com, _baud)
                {
                    DtrEnable = true,
                    Encoding = Encoding.ASCII,
                    ReadTimeout = 500
                };
                _sp.DataReceived += OnData;
                _sp.Open();
                Console.WriteLine($"[Serial] {_com} opened (baud {_baud}).");
            }
        }
        catch (Exception ex)
        {
            Console.WriteLine($"[Serial] Error opening port: {ex.Message}");
        }
        finally
        {
            _initLock.Release();
        }
    }

    private void OnData(object? sender, SerialDataReceivedEventArgs e)
    {
        _lastRx = DateTime.UtcNow;

        try
        {
            string incoming = _sp!.ReadExisting();
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
                    _ = ProcessLineAsync(line);
                }
            }

            // Handle incomplete final line
            if (_serialBuffer.Length > 0)
            {
                string maybeLine = _serialBuffer.ToString().Trim();
                var parts = maybeLine.Split(',');
                if (parts.Length >= 9)
                {
                    _serialBuffer.Clear();
                    _ = ProcessLineAsync(maybeLine);
                }
            }
        }
        catch (Exception ex)
        {
            Console.WriteLine($"[RX] Error in OnData: {ex.Message}\n{ex.StackTrace}");
        }
    }

    private async Task ProcessLineAsync(string trimmed)
    {
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

        using var scope = _scopeFactory.CreateScope();
        var canService = scope.ServiceProvider.GetRequiredService<CanService>();

        await canService.ProcessCanMessageAsync(canId, bytes, parsedTimestamp);
        await CsvLogger.AppendAsync(canId, bytes, timestamp);
    }

    public async Task SendAsync(Command cmd)
    {
        EnsurePortOpen();

        await _txLock.WaitAsync();
        try
        {
            var msg = cmd.ToMessage();
            _sp!.Write(msg, 0, msg.Length);
            Console.WriteLine($"[TX] {Encoding.ASCII.GetString(msg).Trim()}");

            byte[] payloadBytes = BitConverter.GetBytes(cmd.Payload);
            Array.Reverse(payloadBytes);
            await CsvLogger.AppendAsync(cmd.CanId, payloadBytes);
        }
        finally
        {
            _txLock.Release();
        }
    }

    protected override Task ExecuteAsync(CancellationToken stoppingToken)
    {
        EnsurePortOpen();

        return Task.Run(async () =>
        {
            while (!stoppingToken.IsCancellationRequested)
            {
                // Reopen if no data has been received in 5 seconds
                if ((DateTime.UtcNow - _lastRx).TotalSeconds > 5)
                {
                    Console.WriteLine("[Serial] RX timeout detected. Reopening port...");

                    try
{
    if (_sp != null)
    {
        _sp.DataReceived -= OnData;

        if (_sp.IsOpen)
            _sp.Close();

        _sp.Dispose();
        _sp = null;
    }
}
catch (Exception ex)
{
    Console.WriteLine($"[Serial] Error closing port: {ex.Message}");
}


                    _sp = null;
                    EnsurePortOpen();
                }

                await Task.Delay(1000, stoppingToken);
            }
        }, stoppingToken);
    }

    public override void Dispose()
    {
        Console.WriteLine("Port is closing");
        try
        {
            if (_sp != null)
            {
                _sp.DataReceived -= OnData;
                _sp.Close();
                _sp.Dispose();
            }
        }
        catch (Exception ex)
        {
            Console.WriteLine($"[Serial] Error during Dispose: {ex.Message}");
        }

        base.Dispose();
    }
}
