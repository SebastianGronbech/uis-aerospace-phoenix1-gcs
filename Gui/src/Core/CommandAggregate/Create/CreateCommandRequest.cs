using MediatR;

namespace Gui.Core.CommandAggregate
{
    public class CreateCommandRequest : IRequest<int>
    {
        public int CanId { get; set; }
        public string PublicId { get; set; } = string.Empty;
        public string Payload { get; set; } = string.Empty;
    }
}
