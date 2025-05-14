using Gui.Core.Domain.Telemetry;
using Gui.API.Hubs;
using Microsoft.AspNetCore.SignalR;

namespace Gui.API.Notifiers;

public class SignalRSubSystemNotifier : ISubSystemNotifier
{
    private readonly IHubContext<DashBoardHub, IDashboardClient> _hubContext;

    public SignalRSubSystemNotifier(IHubContext<DashBoardHub, IDashboardClient> hubContext)
    {
        _hubContext = hubContext;
    }

    public async Task NotifyDashboardAsync(string subSystemId, string eventName, object dataPayload)
    {
        if (string.IsNullOrWhiteSpace(subSystemId))
        {
            throw new ArgumentException("Subsystem ID cannot be null or empty.", nameof(subSystemId));
        }

        var groupName = $"subsystem-{subSystemId}";
        await _hubContext.Clients.Group(groupName).ReceiveSubSystemUpdate(subSystemId, eventName, dataPayload);
    }

    public async Task NotifySubscribersAsync(string topic, string eventName, object dataPayload)
    {
        if (string.IsNullOrWhiteSpace(topic))
        {
            throw new ArgumentException("Topic cannot be null or empty.", nameof(topic));
        }

        await _hubContext.Clients.Group(topic).ReceiveSubSystemUpdate(topic, eventName, dataPayload);
    }
}
