namespace Gui.Core.Domain.Telemetry
{
    public class CanService
    {
        private readonly IMessageRepository _messageRepository;
        private readonly ISubSystemNotifier _subSystemNotifier;

        public CanService(
            IMessageRepository messageRepository,
            ISubSystemNotifier subSystemNotifier
        )
        {
            _messageRepository = messageRepository;
            _subSystemNotifier = subSystemNotifier;
        }

        public async Task ProcessCanMessageAsync(int messageId, byte[] frame, DateTime timestamp)
        {
           // Console.WriteLine($"📥 Received CAN message: ID={messageId}, Timestamp={timestamp}, Frame={BitConverter.ToString(frame)}");

            var message = await _messageRepository.GetMessageByIdAsync(messageId)
                ?? throw new InvalidOperationException($"Message with ID {messageId} not found.");

            var signalMeasurements = new List<SignalMeasurement>();

            switch (messageId)
            {
                // 🚀 Rocket telemetry or 🌍 Ground telemetry
                case 300:
                case 320:
                    foreach (var signal in message.Signals)
                    {
                        var decodedValue = DecodeSignal(frame, signal);
                        var signalMeasurement = new SignalMeasurement(signal.Name, messageId, decodedValue, timestamp);
                       // Console.WriteLine($"[{messageId}] {signal.Name} = {decodedValue} at {timestamp}");
                        signalMeasurements.Add(signalMeasurement);
                    }

                    var payload = signalMeasurements.ToDictionary(m => m.Name, m => m.Value);
                    var targetSubsystem = messageId == 300 ? "rocket" : "ground";

                    //Console.WriteLine($"📤 Notifying dashboard: {targetSubsystem} - telemetry-update");
                    await _subSystemNotifier.NotifyDashboardAsync(targetSubsystem, "telemetry-update", payload);
                    break;
                case 302:
                case 322:
                    foreach (var signal in message.Signals)
                    {
                        var decodedValue = DecodeSignal(frame, signal);
                        var signalMeasurement = new SignalMeasurement(signal.Name, messageId, decodedValue, timestamp);
                        //Console.WriteLine($"[{messageId}] PacketCounter - {signal.Name} = {decodedValue} at {timestamp}");
                        signalMeasurements.Add(signalMeasurement);
                     }

                    var packetPayload = signalMeasurements.ToDictionary(m => m.Name, m => m.Value);
                    var packetSubsystem = messageId == 302 ? "rocket" : "ground";
                    await _subSystemNotifier.NotifyDashboardAsync(packetSubsystem, "packet-counters", packetPayload);
                    //Console.WriteLine($"📦 Packet counters sent to dashboard: {packetSubsystem}");
                    break;    

                // 🚀 Rocket or 🌍 Ground signal quality
                case 301:
                case 321:
                    double? rssi = null;
                    double? snr = null;

                    foreach (var signal in message.Signals)
                    {
                        var decodedValue = DecodeSignal(frame, signal);
                        signalMeasurements.Add(new SignalMeasurement(signal.Name, messageId, decodedValue, timestamp));

                        if (signal.Name.Equals("Rssi", StringComparison.OrdinalIgnoreCase))
                            rssi = Convert.ToDouble(decodedValue);
                        else if (signal.Name.Equals("Snr", StringComparison.OrdinalIgnoreCase))
                            snr = Convert.ToDouble(decodedValue);
                    }

                    if (rssi.HasValue || snr.HasValue)
                    {
                        var signalQualityPayload = new
                        {
                            Rssi = rssi,
                            Snr = snr,
                            Timestamp = timestamp
                        };

                        var subsystem = messageId == 301 ? "rocket" : "ground";

                       // Console.WriteLine($"📶 Signal Quality [{subsystem}]: RSSI={rssi}, SNR={snr}");
                       // Console.WriteLine($"📤 Notifying dashboard: {subsystem} - signal-quality");
                        await _subSystemNotifier.NotifyDashboardAsync(subsystem, "signal-quality", signalQualityPayload);
                    }

                    break;

                default:
                    foreach (var signal in message.Signals)
                    {
                        var decodedValue = DecodeSignal(frame, signal);
                        var signalMeasurement = new SignalMeasurement(signal.Name, messageId, decodedValue, timestamp);
                        //Console.WriteLine($"[default] {signal.Name} = {decodedValue} at {timestamp}");
                        signalMeasurements.Add(signalMeasurement);
                    }
                    break;
            }

            // Persisting signals could happen here if needed
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
