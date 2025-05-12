using MediatR;

namespace Gui.Core.CommandAggregate
{
    public class DeleteCommandRequest : IRequest<bool>
    {
        public string PublicId { get; set; } = string.Empty;
    }
}
