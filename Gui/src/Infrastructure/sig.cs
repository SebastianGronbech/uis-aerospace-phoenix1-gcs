// using System.Text.Json;

// public class Signal
// {
//     public string Name { get; set; } = string.Empty;
//     public int StartBit { get; set; }
//     public int Length { get; set; }
//     public bool IsSigned { get; set; }
//     public double Factor { get; set; }
//     public double Offset { get; set; }
//     public string Type { get; set; } = string.Empty;
// }

// public class Message
// {
//     public int Id { get; set; }
//     public string Name { get; set; } = string.Empty;
//     public List<Signal> Signals { get; set; } = new List<Signal>();
// }


// public class CANDecoder
// {
//     public static ulong ExtractBits(byte[] data, int startBit, int length)
//     {
//         int byteIndex = startBit / 8;
//         int bitOffset = startBit % 8;

//         ulong value = 0;

//         for (int i = 0; i < (length + 7) / 8; i++)
//         {
//             if (byteIndex + i >= data.Length)
//                 break;

//             value |= ((ulong)data[byteIndex + i]) << (i * 8);
//         }

//         value >>= bitOffset;
//         value &= (1UL << length) - 1;
//         return value;
//     }

//     public static object DecodeSignal(byte[] frame, Signal signal)
//     {
//         ulong rawValue = ExtractBits(frame, signal.StartBit, signal.Length);

//         long signedValue = signal.IsSigned ? (long)(rawValue | (~0UL << signal.Length)) : (long)rawValue;
//         double scaledValue = (signedValue * signal.Factor) + signal.Offset;

//         switch (signal.Type.ToLower())
//         {
//             case "bool":
//                 return scaledValue != 0;

//             case "int":
//                 return signal.Length switch
//                 {
//                     8 => signal.IsSigned ? (sbyte)scaledValue : (byte)scaledValue,
//                     16 => signal.IsSigned ? (short)scaledValue : (ushort)scaledValue,
//                     32 => signal.IsSigned ? (int)scaledValue : (uint)scaledValue,
//                     64 => signal.IsSigned ? (long)scaledValue : (ulong)scaledValue,
//                     _ => throw new NotSupportedException($"Type {signal.Type} with length {signal.Length} is not supported.")
//                 };

//             case "float":
//                 return signal.Length switch
//                 {
//                     32 => (float)scaledValue,
//                     64 => (double)scaledValue,
//                     _ => throw new NotSupportedException($"Type {signal.Type} with length {signal.Length} is not supported.")
//                 };

//             default:
//                 throw new NotSupportedException($"Type {signal.Type} is not supported.");
//         }
//     }

//     public static Dictionary<string, object> ParseFrame(byte[] frame, string jsonPath)
//     {
//         string json = File.ReadAllText(jsonPath);
//         var messages = JsonSerializer.Deserialize<List<Message>>(json) ?? throw new InvalidOperationException("Failed to deserialize JSON.");
//         var result = new Dictionary<string, object>();

//         foreach (var message in messages)
//         {
//             foreach (var signal in message.Signals)
//             {
//                 result[signal.Name] = DecodeSignal(frame, signal);
//             }
//         }

//         return result;
//     }
// }


using System.Text.Json;

public class Signal
{
    public string Name { get; set; } = string.Empty;
    public int StartBit { get; set; }
    public int Length { get; set; }
    public bool IsSigned { get; set; }
    public string Type { get; set; } = string.Empty;
}

public class Message
{
    public int Id { get; set; }
    public string Name { get; set; } = string.Empty;
    public List<Signal> Signals { get; set; } = new List<Signal>();
}


public class CANDecoder
{
    public static ulong ExtractBits(byte[] data, int startBit, int length)
    {
        int byteIndex = startBit / 8;
        int bitOffset = startBit % 8;

        ulong value = 0;

        for (int i = 0; i < (length + 7) / 8; i++)
        {
            if (byteIndex + i >= data.Length)
                break;

            value |= ((ulong)data[byteIndex + i]) << (i * 8);
        }

        value >>= bitOffset;
        value &= (1UL << length) - 1;
        return value;
    }

    public static object DecodeSignal(byte[] frame, Signal signal)
    {
        Console.WriteLine($"Decoding signal: {signal.Name} (StartBit: {signal.StartBit}, Length: {signal.Length}, Type: {signal.Type})");
        ulong rawValue = ExtractBits(frame, signal.StartBit, signal.Length);

        long signedValue = signal.IsSigned ? (long)(rawValue | (~0UL << signal.Length)) : (long)rawValue;

        switch (signal.Type.ToLower())
        {
            case "bool":
                return signedValue != 0;

            case "int":
                return signal.Length switch
                {
                    8 => signal.IsSigned ? (sbyte)signedValue : (byte)signedValue,
                    16 => signal.IsSigned ? (short)signedValue : (ushort)signedValue,
                    32 => signal.IsSigned ? (int)signedValue : (uint)signedValue,
                    64 => signal.IsSigned ? (long)signedValue : (ulong)signedValue,
                    _ => throw new NotSupportedException($"Type {signal.Type} with length {signal.Length} is not supported.")
                };

            case "float":
                return signal.Length switch
                {
                    32 => (float)signedValue,
                    64 => (double)signedValue,
                    _ => throw new NotSupportedException($"Type {signal.Type} with length {signal.Length} is not supported.")
                };

            default:
                throw new NotSupportedException($"Type {signal.Type} is not supported.");
        }
    }

    public static Dictionary<string, object> ParseFrame(int arbitrationId, byte[] frame, string jsonPath)
    {
        string json = File.ReadAllText(jsonPath);
        if (string.IsNullOrEmpty(json))
            throw new InvalidOperationException("JSON file is empty or not found.");

        var messages = JsonSerializer.Deserialize<List<Message>>(json)
            ?? throw new InvalidOperationException("Failed to deserialize JSON.");
        var result = new Dictionary<string, object>();

        var messageToDecode = messages.FirstOrDefault(m => m.Id == arbitrationId)
            ?? throw new InvalidOperationException($"Message with ID {arbitrationId} not found in definitions.");

        Console.WriteLine($"Processing message: {messageToDecode.Name} (ID: {messageToDecode.Id})");

        foreach (var signal in messageToDecode.Signals)
        {
            result[signal.Name] = DecodeSignal(frame, signal);
        }

        return result;
    }
}

class Program
{
    static void Main(string[] args)
    {
        string jsonPath = "definitions.json";

        var arbitrationId = 301;
        byte[] frame = [0b11111010, 0x00, 0x0A, 0x00, 0x10, 0x0E, 0x00, 0x00];
        var timeStamp = DateTime.UtcNow;

        Console.WriteLine("CAN Frame: " + BitConverter.ToString(frame));

        var decodedData = CANDecoder.ParseFrame(arbitrationId, frame, jsonPath);

        Console.WriteLine("Decoded Data: ");

        foreach (var item in decodedData)
        {
            Console.WriteLine($"{item.Key}: {item.Value} ({item.Value.GetType().Name})");
        }
    }
}