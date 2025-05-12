namespace Gui.Core.CommandAggregate
{
    public interface ICommandRepository
    {
        Task<(int CanId, string Payload)?> FindByPublicIdAsync(string publicId, CancellationToken cancellationToken);
    }
}
