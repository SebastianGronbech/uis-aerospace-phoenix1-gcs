using System.Text.Json;
using Gui.Core.Domain.Telemetry;

namespace Gui.Infrastructure.Repositories;

public class MessageRepository : IMessageRepository
{
    private readonly string _filePath = "../Infrastructure/definitions.json";

    public async Task<Message?> GetMessageByIdAsync(int id)
    {
        if (!File.Exists(_filePath))
        {
            throw new FileNotFoundException($"The file {_filePath} was not found.");
        }

        try
        {
            var json = await File.ReadAllTextAsync(_filePath);
            var options = new JsonSerializerOptions
            {
                PropertyNameCaseInsensitive = true,
                IncludeFields = true,
            };

            //Console.WriteLine($"Deserializing JSON from {_filePath}...");

            var messages = JsonSerializer.Deserialize<List<Message>>(
                json, options) ?? throw new InvalidOperationException("Failed to deserialize the JSON file.");

            //Console.WriteLine($"Deserialized {messages.Count} messages.");

            return messages?.FirstOrDefault(m => m.Id == id);
        }
        catch (JsonException ex)
        {
            throw new InvalidOperationException("Failed to deserialize the JSON file.", ex);
        }
    }
}