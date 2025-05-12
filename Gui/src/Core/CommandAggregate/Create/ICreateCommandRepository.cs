

namespace Gui.Core.CommandAggregate
{
    public interface ICreateCommandRepository
    {
        Task<int> CreateAsync(int id, string publicId, string payload, CancellationToken cancellationToken);
    }
}
