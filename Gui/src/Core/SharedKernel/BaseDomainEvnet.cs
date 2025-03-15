using MediatR;

namespace Gui.Core.SharedKernel;

public abstract class BaseDomainEvent : INotification
{
    public DateTimeOffset DateOccurred { get; protected set; } = DateTime.UtcNow;
}