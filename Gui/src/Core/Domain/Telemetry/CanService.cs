namespace Gui.Core.Domain.Telemetry
{
    public class CanService
    {
        private readonly IMessageRepository _messageRepository;
        private readonly ISubSystemNotifier _subSystemNotifier;
        // private readonly ISignalMeasurementRepository _signalMeasurementRepository;
        // private readonly ITelemetryNotifier _telemetryNotifier;

        public CanService(
            IMessageRepository messageRepository,
            ISubSystemNotifier subSystemNotifier
            // ITelemetryNotifier telemetryNotifier,
            // ISignalMeasurementRepository signalMeasurementRepository
        )
        {
            _messageRepository = messageRepository;
            _subSystemNotifier = subSystemNotifier;
            // _telemetryNotifier = telemetryNotifier;
            // _signalMeasurementRepository = signalMeasurementRepository;
        }

        public async Task ProcessCanMessageAsync(int messageId, byte[] frame, DateTime timestamp)
        {
            var message = await _messageRepository.GetMessageByIdAsync(messageId)
                ?? throw new InvalidOperationException($"Message with ID {messageId} not found.");

            var signalMeasurements = new List<SignalMeasurement>();

            switch (messageId)
            {
                case 300:
                    foreach (var signal in message.Signals)
                    {
                        var decodedValue = DecodeSignal(frame, signal);
                        var signalMeasurement = new SignalMeasurement(signal.Name, messageId, decodedValue, timestamp);
                        Console.WriteLine($"[300] {signal.Name} = {decodedValue} at {timestamp}");
                        signalMeasurements.Add(signalMeasurement);
                    }

                    var payload = signalMeasurements.ToDictionary(m => m.Name, m => m.Value);
                    await _subSystemNotifier.NotifyDashboardAsync("rocket", "telemetry-update", payload);
                    Console.WriteLine("🚀 Notifying dashboard");
                    break;

                case 301:
                    double? rssi = null;
                    double? snr = null;

                    foreach (var signal in message.Signals)
                    {
                        var decodedValue = DecodeSignal(frame, signal);
                        signalMeasurements.Add(new SignalMeasurement(signal.Name, messageId, decodedValue, timestamp));

                        if (signal.Name.Equals("Rssi", StringComparison.OrdinalIgnoreCase))
                        {
                            rssi = Convert.ToDouble(decodedValue);
                        }
                        else if (signal.Name.Equals("Snr", StringComparison.OrdinalIgnoreCase))
                        {
                            snr = Convert.ToDouble(decodedValue);
                        }
                    }

                    if (rssi.HasValue || snr.HasValue)
                    {
                        var signalQualityPayload = new
                        {
                            Rssi = rssi,
                            Snr = snr,
                            Timestamp = timestamp
                        };

                        await _subSystemNotifier.NotifyDashboardAsync("rocket", "signal-quality", signalQualityPayload);
                        Console.WriteLine("📶 Signal Quality sent");
                    }

                    break;

                default:
                    foreach (var signal in message.Signals)
                    {
                        var decodedValue = DecodeSignal(frame, signal);
                        var signalMeasurement = new SignalMeasurement(signal.Name, messageId, decodedValue, timestamp);
                        Console.WriteLine($"[default] {signal.Name} = {decodedValue} at {timestamp}");
                        signalMeasurements.Add(signalMeasurement);
                    }

                    break;
            }

            // Optionally persist signalMeasurements or do further processing here
            // await _signalMeasurementRepository.AddSignalMeasurementsAsync(signalMeasurements);
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
}
