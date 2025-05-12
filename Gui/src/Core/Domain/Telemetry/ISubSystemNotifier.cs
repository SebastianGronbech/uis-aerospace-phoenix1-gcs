namespace Gui.Core.Domain.Telemetry
{
    public interface ISubSystemNotifier
    {
        Task NotifyDashboardAsync(string subSystemId, string eventName, object dataPayload);
        Task NotifySubscribersAsync(string topic, string eventName, object dataPayload);
    }
}