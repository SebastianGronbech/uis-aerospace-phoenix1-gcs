namespace Gui.Core.Domain.Telemetry;

public class CanService
{
    private readonly IMessageRepository _messageRepository;
    private readonly ISignalMeasurementRepository _signalMeasurementRepository;
    // private readonly ISubSystemNotifier _subSystemNotifier;
    // private readonly ITelemetryNotifier _telemetryNotifier;

    public CanService(
        IMessageRepository messageRepository,
        ISignalMeasurementRepository signalMeasurementRepository
        // ISubSystemNotifier subSystemNotifier,
        // ITelemetryNotifier telemetryNotifier,
        )
    {
        _messageRepository = messageRepository;
        _signalMeasurementRepository = signalMeasurementRepository;
        // _subSystemNotifier = subSystemNotifier;
        // _telemetryNotifier = telemetryNotifier;
    }

    public async Task ProcessCanMessageAsync(int messageId, byte[] frame, DateTime timestamp)
    {
        var message = await _messageRepository.GetMessageByIdAsync(messageId)
            ?? throw new InvalidOperationException($"Message with ID {messageId} not found.");

        var signalMeasurements = new List<SignalMeasurement>();

        // Process the CAN message
        foreach (var signal in message.Signals)
        {
            // Decode the signal from the frame
            // var decodedValue = signal.Decode(frame);
            var decodedValue = DecodeSignal(frame, signal);

            var signalMeasurement = new SignalMeasurement(signal.Name, messageId, decodedValue, timestamp);
            Console.WriteLine($"Message ID: {messageId}");
            Console.WriteLine($"Decoded signals {signal.Name} = {decodedValue} at {timestamp}");

            signalMeasurements.Add(signalMeasurement);


            // Notify subscribers about the decoded value
            // await _subSystemNotifier.NotifyDashboardAsync(signal.SubSystemId, signal.Name, decodedValue);
        }



        await _signalMeasurementRepository.AddSignalMeasurementsAsync(signalMeasurements);

        // Process the CAN message and notify subscribers
        // await _subSystemNotifier.NotifySubscribersAsync("CAN", "MessageReceived", data);
        // await _telemetryNotifier.BroadcastTelemetryAsync(data);
    }

    public static ulong ExtractBits(byte[] data, int startBit, int length)
    {
        int byteIndex = startBit / 8;
        int bitOffset = startBit % 8;
        ulong value = 0;

        for (int i = 0; i < (length + 7) / 8; i++)
        {
            if (byteIndex + i >= data.Length) break;
            value |= ((ulong)data[byteIndex + i]) << (i * 8);
        }

        value >>= bitOffset;
        return value & ((1UL << length) - 1);
    }

    public static object DecodeSignal(byte[] frame, Signal signal)
    {
        ulong rawValue = ExtractBits(frame, signal.StartBit, signal.Length);
        long signedValue = signal.IsSigned ? (long)(rawValue | (~0UL << signal.Length)) : (long)rawValue;

        return signal.Type.ToLower() switch
        {
            "bool" => signedValue != 0,
            "int" => signal.Length switch
            {
                8 => signal.IsSigned ? (sbyte)signedValue : (byte)signedValue,
                16 => signal.IsSigned ? (short)signedValue : (ushort)signedValue,
                32 => signal.IsSigned ? (int)signedValue : (uint)signedValue,
                _ => throw new NotSupportedException($"Unsupported length: {signal.Length}")
            },
            "float" => signal.Length switch
            {
                32 => BitConverter.ToSingle(BitConverter.GetBytes((uint)signedValue), 0),
                64 => BitConverter.ToDouble(BitConverter.GetBytes((ulong)signedValue), 0),
                _ => throw new NotSupportedException($"Unsupported length: {signal.Length}")
            },
            _ => throw new NotSupportedException($"Unsupported type: {signal.Type}")
        };
    }
}