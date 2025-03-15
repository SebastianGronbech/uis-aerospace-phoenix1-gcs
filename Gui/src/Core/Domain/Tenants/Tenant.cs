using Gui.Core.SharedKernel;

namespace Core.Domain.Tenants;

public class Tenant : BaseEntity
{
    public Guid Id { get; protected set; }
    public string Name { get; private set; }

    private readonly HashSet<User> _users = new();
    public IReadOnlyCollection<User> Users => _users;

    public DateTimeOffset CreatedAt { get; protected set; }
    public DateTimeOffset? UpdatedAt { get; private set; }
    public DateTimeOffset? DeletedAt { get; protected set; }

    public Tenant(Guid id, string name)
    {
        Id = id;
        Name = name;
        CreatedAt = DateTimeOffset.UtcNow;
    }

    public void AddUser(User user)
    {
        if (user == null)
        {
            throw new ArgumentNullException(nameof(user));
        }

        _users.Add(user);
        UpdatedAt = DateTimeOffset.UtcNow;
    }

    public void SetUserToAdmin(User user)
    {
        if (user == null)
        {
            throw new ArgumentNullException(nameof(user));
        }

        user.SetRole(UserRole.Admin);
        // Events.Add(new TenantUserSetToAdminEvent(Id, tenantUser.Id));
    }
}