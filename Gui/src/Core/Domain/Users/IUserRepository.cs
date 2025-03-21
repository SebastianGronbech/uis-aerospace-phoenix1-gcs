namespace Gui.Core.Domain.Users;

public interface IUserRepository
{
    Task<List<User>> GetAllAsync(CancellationToken cancellationToken);
    Task<User?> GetByIdAsync(Guid id, CancellationToken cancellationToken = default);
    void Add(User user);
    void Remove(User user);
}