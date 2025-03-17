using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.SignalR;
using System.Security.Claims;

namespace Infrastructure.Hubs
{
    [Authorize] 
    public class ChatHub : Hub
    {
        public override async Task OnConnectedAsync()
        {
            var username = Context.User?.Identity?.Name;
            if (username != null)
            {
                await Clients.All.SendAsync("ReceiveMessage", "Server", $"{username} has joined the chat.");
            }
            await base.OnConnectedAsync();
        }

        public async Task SendMessage(string message)
        {
            var username = Context.User?.Identity?.Name;
            if (username != null)
            {
                await Clients.All.SendAsync("ReceiveMessage", username, message);
            }
        }
    }
}
