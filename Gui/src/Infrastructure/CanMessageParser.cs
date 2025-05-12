namespace Gui.Infrastructure;

public class CanMessageParser
{
    private readonly Dictionary<int, Func<int, byte[], DateTime, object>> _parsers;

    public CanMessageParser()
    {
        _parsers = new Dictionary<int, Func<int, byte[], DateTime, object>>
        {
            { 300, (id, data, timestamp) => ParseTelemetryStatusMessage(id, data, timestamp, "Rocket")},
            { 301, (id, data, timestamp) => ParseTelemetrySignalQualityMessage(id, data, timestamp, "Rocket")},
            { 302, (id, data, timestamp) => ParseTelemetryMessageCountersMessage(id, data, timestamp, "Rocket")},
            { 303, (id, data, timestamp) => ParseTelemetryBufferMeasurementMessage(id, data, timestamp, "Rocket")},
            { 320, (id, data, timestamp) => ParseTelemetryStatusMessage(id, data, timestamp, "Ground")},
            { 321, (id, data, timestamp) => ParseTelemetrySignalQualityMessage(id, data, timestamp, "Ground")},
            { 322, (id, data, timestamp) => ParseTelemetryMessageCountersMessage(id, data, timestamp, "Ground")},
            { 323, (id, data, timestamp) => ParseTelemetryBufferMeasurementMessage(id, data, timestamp, "Ground")},
        };
    }

    public object ParseMessage(int id, byte[] data, DateTime timestamp)
    {
        if (_parsers.TryGetValue(id, out var parser))
        {
            return parser(id, data, timestamp);
        }

        throw new ArgumentException($"No parser found for message ID: {id}");
    }

    private static object ParseTelemetryStatusMessage(int id, byte[] data, DateTime timestamp, string source)
    {
        if (data.Length < 8) throw new ArgumentException($"Data length insufficient for Telemetry Status. Expected 8, got {data.Length}.", nameof(data));

        // bool * 16 (2 bytes)
        // Assuming the 16 bools are packed into the first two bytes (ushort)
        ushort statusFlags = BitConverter.ToUInt16(data, 0);

        return new
        {
            // Extracting individual bits. Bit 0 is the LSB.
            IsRunning = (statusFlags & (1 << 0)) != 0,
            IsNotFrozenIndicator = (statusFlags & (1 << 1)) != 0,
            IsNodeIndicator = (statusFlags & (1 << 2)) != 0,
            IsCanRxNotFull = (statusFlags & (1 << 3)) != 0,
            IsCanTxNotFull = (statusFlags & (1 << 4)) != 0,
            IsSerialTxNotFull = (statusFlags & (1 << 5)) != 0,
            IsSerialRxNotFull = (statusFlags & (1 << 6)) != 0,
            // Bits 7-15 are unused according to the CSV for ID 300
            LostPackages = BitConverter.ToUInt16(data, 2), // uint16_t
            TimeSinceBootMs = BitConverter.ToUInt32(data, 4), // uint32_t
            Source = source
        };
    }

    private static object ParseTelemetrySignalQualityMessage(int id, byte[] data, DateTime timestamp, string source)
    {
        if (data.Length < 8) throw new ArgumentException($"Data length insufficient for Telemetry Signal Quality. Expected 8, got {data.Length}.", nameof(data));

        return new
        {
            SignalQuality = BitConverter.ToSingle(data, 0),
            SignalStrength = BitConverter.ToSingle(data, 4),
            Source = source
        };
    }

    private static object ParseTelemetryMessageCountersMessage(int id, byte[] data, DateTime timestamp, string source)
    {
        if (data.Length < 8) throw new ArgumentException($"Data length insufficient for Telemetry Message Counters. Expected 8, got {data.Length}.", nameof(data));

        return new
        {
            MessageCounter = BitConverter.ToUInt32(data, 0),
            LostMessages = BitConverter.ToUInt32(data, 4),
            Source = source
        };
    }

    private static object ParseTelemetryBufferMeasurementMessage(int id, byte[] data, DateTime timestamp, string source)
    {
        if (data.Length < 8) throw new ArgumentException($"Data length insufficient for Telemetry Buffer Measurement. Expected 8, got {data.Length}.", nameof(data));

        return new
        {
            CanRxBufferLevel = BitConverter.ToUInt16(data, 0),
            CanTxBufferLevel = BitConverter.ToUInt16(data, 2),
            SerialRxBufferLevel = BitConverter.ToUInt16(data, 4),
            SerialTxBufferLevel = BitConverter.ToUInt16(data, 6),
            Source = source
        };
    }
}