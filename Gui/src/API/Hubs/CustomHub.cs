using Microsoft.AspNetCore.SignalR;

namespace Gui.API.Hubs;

public class CustomHub : Hub
{
    private readonly ILogger<CustomHub> _logger;

    public CustomHub(ILogger<CustomHub> logger)
    {
        _logger = logger ?? throw new ArgumentNullException(nameof(logger));
    }

    public override Task OnConnectedAsync()
    {
        _logger.LogInformation("Client connected: {ConnectionId}", Context.ConnectionId);

        var data = new
        {
            Timestamp = DateTime.UtcNow,
            Speed = 22424.2,
            RPM = 23424.2
        };
        // You can also send a message to the client that just connected
        // Clients.Caller.SendAsync("ReceiveMessage", "Welcome to the hub!");
        Clients.Caller.SendAsync("ReceiveMessage", data);
        return base.OnConnectedAsync();
    }

    public override Task OnDisconnectedAsync(Exception? exception)
    {
        _logger.LogInformation("Client disconnected: {ConnectionId}", Context.ConnectionId);
        return base.OnDisconnectedAsync(exception);
    }

    public async Task ReceiveTelemetryData(string message)
    {
        _logger.LogInformation("Received message: {Message}", message);
        // Broadcast the message to all connected clients
        await Clients.All.SendAsync("ReceiveTelemetryData", message);
    }
}