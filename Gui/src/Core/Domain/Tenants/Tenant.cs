using Gui.Core.Exceptions;
using Gui.Core.SharedKernel;

namespace Gui.Core.Domain.Tenants;

public class Tenant : BaseEntity
{
    public Guid Id { get; protected set; }
    public string Name { get; private set; }

    private readonly HashSet<User> _users = new();
    public IReadOnlyCollection<User> Users => _users;

    public DateTimeOffset CreatedAt { get; }
    public DateTimeOffset? UpdatedAt { get; private set; }
    public DateTimeOffset? DeletedAt { get; protected set; }

    public Tenant(Guid id, string name)
    {
        if (id == Guid.Empty)
        {
            throw new ArgumentException("Id cannot be empty", nameof(id));
        }

        if (string.IsNullOrWhiteSpace(name))
        {
            throw new ArgumentException("Name cannot be empty", nameof(name));
        }

        Id = id;
        Name = name;
        CreatedAt = DateTimeOffset.UtcNow;
    }

    public void AddUser(Guid userId)
    {
        var user = User.Create(userId);
        if (!_users.Add(user))
        {
            throw new InvalidOperationException($"User with ID {userId} already exists");
        }

        UpdatedAt = DateTimeOffset.UtcNow;
    }

    public void RemoveUser(Guid userId)
    {
        var user = _users.FirstOrDefault(u => u.Id == userId);
        if (user == null)
        {
            throw new EntityNotFoundException($"User with ID {userId} not found.");
        }

        _users.Remove(user);
        UpdatedAt = DateTimeOffset.UtcNow;
    }

    public void SetUserToAdmin(Guid userId)
    {
        var user = _users.FirstOrDefault(u => u.Id == userId);
        if (user == null)
        {
            throw new EntityNotFoundException($"User with ID {userId} not found.");
        }

        user.SetRole(UserRole.Admin);
        UpdatedAt = DateTimeOffset.UtcNow;
        // TODO: Add domain event
    }
}