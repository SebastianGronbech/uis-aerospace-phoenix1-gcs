

namespace Gui.Core.CommandAggregate
{
    public interface IPortSender
    {
        Task SendAsync(Command command);
    }
}
