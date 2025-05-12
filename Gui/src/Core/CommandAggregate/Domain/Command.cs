using System.Text;

namespace Gui.Core.CommandAggregate
{
    public class Command
    {
        public int CanId { get; }
        public ulong Payload { get; }

        public Command(int canId, ulong payload)
        {
            CanId = canId;
            Payload = payload;
        }

        public byte[] ToMessage()
{
    // Split payload into 8 bytes
    byte[] payloadBytes = BitConverter.GetBytes(Payload);
    Array.Reverse(payloadBytes); // Convert to big-endian for sending

    // Convert bytes to hex pairs (e.g., "AA", "01", etc.)
    string[] hexParts = payloadBytes.Select(b => b.ToString("X2")).ToArray();

    // Join all parts with commas: e.g. 304,AA,BB,...
    string formatted = $"{CanId},{string.Join(",", hexParts)}\n";

    return Encoding.ASCII.GetBytes(formatted);
}

    }
}
