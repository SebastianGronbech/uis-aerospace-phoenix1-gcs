namespace Gui.Core.Domain.Telemetry;

public interface IMessageRepository
{
    Task<Message?> GetMessageByIdAsync(int id);
}