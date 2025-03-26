namespace Gui.Core.Domain.Users;

public class UserRoleAssignment
{
    public Guid Id { get; }
    public Guid UserId { get; private set; }
    public Guid UnitId { get; private set; }
    public UserRole Role { get; private set; }

    public DateTimeOffset CreatedAt { get; }
    public DateTimeOffset? UpdatedAt { get; private set; }
    public DateTimeOffset? DeletedAt { get; protected set; }

    private UserRoleAssignment(Guid userId, Guid unitId, UserRole role)
    {
        Id = Guid.NewGuid();
        UserId = userId;
        UnitId = unitId;
        Role = role;
        CreatedAt = DateTimeOffset.UtcNow;
    }

    internal static UserRoleAssignment Create(Guid userId, Guid unitId, UserRole role)
    {
        if (unitId == Guid.Empty)
        {
            throw new ArgumentException("UnitId cannot be empty", nameof(unitId));
        }

        if (userId == Guid.Empty)
        {
            throw new ArgumentException("UserId cannot be empty", nameof(userId));
        }

        return new UserRoleAssignment(userId, unitId, role);
    }

    public void SetRole(UserRole role)
    {
        if (Role == role)
        {
            return;
        }

        Role = role;
        UpdatedAt = DateTimeOffset.UtcNow;
    }
}