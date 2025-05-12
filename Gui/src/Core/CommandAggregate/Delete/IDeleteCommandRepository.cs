

namespace Gui.Core.CommandAggregate
{
    public interface IDeleteCommandRepository
    {
        Task<bool> DeleteByPublicIdAsync(string publicId, CancellationToken cancellationToken);
    }
}
