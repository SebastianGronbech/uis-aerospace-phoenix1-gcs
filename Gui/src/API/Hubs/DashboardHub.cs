using Microsoft.AspNetCore.SignalR;

namespace Gui.API.Hubs;

public interface IDashboardClient
{
    Task ReceiveSubSystemUpdate(string subSystemId, string eventName, object data);
    Task ReceiveError(string message);
    Task ReceiveSystemNotification(string notification);
}

public class DashBoardHub : Hub<IDashboardClient>
{
    private readonly ILogger<IDashboardClient> _logger;

    public DashBoardHub(ILogger<IDashboardClient> logger)
    {
        _logger = logger ?? throw new ArgumentNullException(nameof(logger));
    }

    public async Task SubscribeToSubSystem(string subSystemId)
    {
        if (string.IsNullOrWhiteSpace(subSystemId))
        {
            throw new ArgumentException("Subsystem ID cannot be null or empty.", nameof(subSystemId));
        }

        var groupName = GetGroupName(subSystemId);
        await Groups.AddToGroupAsync(Context.ConnectionId, groupName);
        await Clients.Caller.ReceiveSystemNotification($"Successfully subscribed to updates for {subSystemId}.");
    }

    public async Task UnsubscribeFromSubSystem(string subSystemId)
    {
        if (string.IsNullOrWhiteSpace(subSystemId))
        {
            throw new ArgumentException("Subsystem ID cannot be null or empty.", nameof(subSystemId));
        }

        var groupName = GetGroupName(subSystemId);
        await Groups.RemoveFromGroupAsync(Context.ConnectionId, groupName);
        await Clients.Caller.ReceiveSystemNotification($"Unsubscribed from updates for {subSystemId}.");
    }


    private static string GetGroupName(string subSystemId)
    {
        return $"subsystem-{subSystemId}";
    }

    public override async Task OnConnectedAsync()
    {
        _logger.LogInformation("Client connected: {ConnectionId}", Context.ConnectionId);
        await Clients.Caller.ReceiveSystemNotification("Welcome! Please subscribe to a sub-system to receive updates.");
        await base.OnConnectedAsync();
    }

    public override Task OnDisconnectedAsync(Exception? exception)
    {
        _logger.LogInformation("Client disconnected: {ConnectionId}", Context.ConnectionId);
        return base.OnDisconnectedAsync(exception);
    }
}