using MediatR;

namespace Gui.Core.CommandAggregate
{
    public class SendCommandRequest : IRequest<string>
    {
        public string PublicId { get; set; } = string.Empty;
    }
}
