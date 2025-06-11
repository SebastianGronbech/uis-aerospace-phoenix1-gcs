using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

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
            var message = await _messageRepository.GetMessageByIdAsync(messageId)
                ?? throw new InvalidOperationException($"Message with ID {messageId} not found.");

            var signalMeasurements = new List<SignalMeasurement>();

            switch (messageId)
            {
                case 300:
                case 320:
                {
                    foreach (var signal in message.Signals)
                        signalMeasurements.Add(new SignalMeasurement(signal.Name, messageId, DecodeSignal(frame, signal), timestamp));

                    var payload = signalMeasurements.ToDictionary(m => m.Name, m => m.Value);
                    var sanitizedPayload = SanitizePayload(payload, timestamp);
                    var targetSubsystem = messageId == 300 ? "rocket" : "ground";

                    await _subSystemNotifier.NotifyDashboardAsync(targetSubsystem, "telemetry-update", sanitizedPayload);
                    break;
                }

                case 302:
                case 322:
                {
                    foreach (var signal in message.Signals)
                        signalMeasurements.Add(new SignalMeasurement(signal.Name, messageId, DecodeSignal(frame, signal), timestamp));

                    var packetPayload = signalMeasurements.ToDictionary(m => m.Name, m => m.Value);
                    var sanitizedPayload = SanitizePayload(packetPayload, timestamp);
                    var packetSubsystem = messageId == 302 ? "rocket" : "ground";

                    await _subSystemNotifier.NotifyDashboardAsync(packetSubsystem, "packet-counters", sanitizedPayload);
                    break;
                }

                case 301:
case 321:
{
    object rssi = null;
    object snr = null;

    foreach (var signal in message.Signals)
    {
        var decodedValue = DecodeSignal(frame, signal);
        signalMeasurements.Add(new SignalMeasurement(signal.Name, messageId, decodedValue, timestamp));

        if (signal.Name.Equals("Rssi", StringComparison.OrdinalIgnoreCase))
            rssi = decodedValue;
        else if (signal.Name.Equals("Snr", StringComparison.OrdinalIgnoreCase))
            snr = decodedValue;
    }

    if (rssi != null || snr != null)
    {
      //  Console.WriteLine($"📶 Signal Quality: RSSI={rssi}, SNR={snr}, Timestamp={timestamp:O}");

        var rawPayload = new Dictionary<string, object>
        {
            ["Rssi"] = rssi ?? 0,
            ["Snr"] = snr ?? 0,
            ["Timestamp"] = timestamp
        };

        var sanitizedPayload = SanitizePayload(rawPayload);
        var subsystem = messageId == 301 ? "rocket" : "ground";

        await _subSystemNotifier.NotifyDashboardAsync(subsystem, "signal-quality", sanitizedPayload);
    }
    break;
}



                case 2:
                case 3:
                case 4:
                case 5:
                case 200:
                case 201:
                case 202:
                case 203:
                case 204:
                case 206:
                {
                    foreach (var signal in message.Signals)
                        signalMeasurements.Add(new SignalMeasurement(signal.Name, messageId, DecodeSignal(frame, signal), timestamp));

                    var estimatorPayload = signalMeasurements.ToDictionary(m => m.Name, m => m.Value);
                    var sanitizedPayload = SanitizePayload(estimatorPayload, timestamp);

                    await _subSystemNotifier.NotifyDashboardAsync("flight-estimator", "estimator-update", sanitizedPayload);
                    break;
                }
 
                case 101:  
                case 104:
                case 105:
                case 106:
                case 107:
                case 108:
                case 109:
                case 110:
                case 111:
                case 112:
                case 113:
                 {
                    foreach (var signal in message.Signals)
                        signalMeasurements.Add(new SignalMeasurement(signal.Name, messageId, DecodeSignal(frame, signal), timestamp));

                    var estimatorPayload = signalMeasurements.ToDictionary(m => m.Name, m => m.Value);
                    var sanitizedPayload = SanitizePayload(estimatorPayload, timestamp);

                    await _subSystemNotifier.NotifyDashboardAsync("ECU", "ECU-update", sanitizedPayload);
                    break;
                }


                default:
                {
                    foreach (var signal in message.Signals)
                        signalMeasurements.Add(new SignalMeasurement(signal.Name, messageId, DecodeSignal(frame, signal), timestamp));

                    var fallbackPayload = signalMeasurements.ToDictionary(m => m.Name, m => m.Value);
                    var sanitizedPayload = SanitizePayload(fallbackPayload, timestamp);

                    await _subSystemNotifier.NotifyDashboardAsync("unknown", "fallback", sanitizedPayload);
                    break;
                }
            }
        }

        private static Dictionary<string, object> SanitizePayload(Dictionary<string, object> payload, DateTime? timestamp = null)
        {
            var sanitized = payload
                .Where(kv =>
                {
                    if (kv.Value is double d)
                        return !double.IsNaN(d) && !double.IsInfinity(d);
                    return true;
                })
                .ToDictionary(kv => kv.Key, kv => kv.Value);

            if (timestamp.HasValue)
                sanitized["LoggedAtUtc"] = timestamp.Value.ToUniversalTime();

            return sanitized;
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
                    1 => (byte)signedValue,
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
