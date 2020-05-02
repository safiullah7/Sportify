using System.Linq;
using System.Security.Claims;
using System.Threading.Tasks;
using Application.Comments;
using MediatR;
using Microsoft.AspNetCore.SignalR;

namespace API.SignalR
{
    public class ChatHub : Hub
    {
        private readonly IMediator _mediator;
        public ChatHub(IMediator mediator)
        {
            _mediator = mediator;
        }

        // below method will be invoked from the client
        public async Task SendComment(Create.Command command)
        {
            string username = GetUsername();

            command.Username = username;

            var comment = await _mediator.Send(command);

            await Clients.Group(command.ActivityId.ToString()).SendAsync("ReceiveComment", comment);
        }

        private string GetUsername()
        {
            return Context.User?.Claims?.FirstOrDefault(x => x.Type == ClaimTypes.NameIdentifier)?.Value;
            // cant access username with only this above. need to make our token available to the HubContext
        }

        /*
            issue with Clients.All is that clients with even different activities opened will receive the newly
            added comment.
            SOLUTION is to make groups and use Clients.Group. Every activity will have its own group. Comment
            added will be sent to its own group

            1. When a user enters into activity detail, we'll add him into a group (AddToGroup)
            2. When he goes away from details, we'll remove him from that specific group (RemoveFromGroup)
            3. groups are unique using activityId
        */

        public async Task AddToGroup(string groupName)
        {
            await Groups.AddToGroupAsync(Context.ConnectionId, groupName);

            var username = GetUsername();
            await Clients.Group(groupName).SendAsync("Send", $"{username} has joined the group");
        }

        // we'll create a method to remove a user from the group as well
        public async Task RemoveFromGroup(string groupName)
        {
            await Groups.RemoveFromGroupAsync(Context.ConnectionId, groupName);

            var username = GetUsername();
            await Clients.Group(groupName).SendAsync("Send", $"{username} has left the group");
        }
    }
}