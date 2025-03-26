using Gui.Core.SharedKernel;

namespace Gui.Core.Domain.Users;

public class User : BaseEntity
{
    public Guid Id { get; protected set; }
    public string Name { get; private set; }

    private readonly HashSet<UserRoleAssignment> _roles = new();
    public IReadOnlyCollection<UserRoleAssignment> Roles => _roles;

    public DateTimeOffset CreatedAt { get; }
    public DateTimeOffset? UpdatedAt { get; private set; }
    public DateTimeOffset? DeletedAt { get; protected set; }

    private User(Guid id, string name)
    {
        Id = id;
        Name = name;
        CreatedAt = DateTimeOffset.UtcNow;
    }

    // internal static User Create(Guid id, string name)
    public static User Create(Guid id, string name)
    {
        if (id == Guid.Empty)
        {
            throw new ArgumentException("Id cannot be empty", nameof(id));
        }

        if (string.IsNullOrWhiteSpace(name))
        {
            throw new ArgumentException("Name cannot be empty", nameof(name));
        }

        return new User(id, name);
    }

    public void AssignRole(Guid unitId, UserRole role)
    {
        if (!_roles.Any(u => u.UnitId == unitId && u.Role == role))
        {
            var unitAccess = UserRoleAssignment.Create(Id, unitId, role);
            _roles.Add(unitAccess);
        }
    }

    public void UpdateRole(Guid unitId, UserRole role)
    {
        var existingRole = _roles.FirstOrDefault(u => u.UnitId == unitId);
        if (existingRole == null)
        {
            throw new InvalidOperationException($"User does not have access to unit with ID {unitId}");
        }

        existingRole.SetRole(role);
        UpdatedAt = DateTimeOffset.UtcNow;
    }
}