namespace Gui.Core.Domain.Users;

public class UnitAccess
{
    public Guid Id { get; }
    public Guid UserId { get; private set; }
    public Guid UnitId { get; private set; }
    public UserRole Role { get; private set; }

    public DateTimeOffset CreatedAt { get; }
    public DateTimeOffset? UpdatedAt { get; private set; }
    public DateTimeOffset? DeletedAt { get; protected set; }

    private UnitAccess(Guid userId, Guid unitId)
    {
        Id = Guid.NewGuid();
        UserId = userId;
        UnitId = unitId;
        Role = UserRole.Spectator;
        CreatedAt = DateTimeOffset.UtcNow;
    }

    internal static UnitAccess Create(Guid userId, Guid unitId)
    {
        if (unitId == Guid.Empty)
        {
            throw new ArgumentException("UnitId cannot be empty", nameof(unitId));
        }

        return new UnitAccess(userId, unitId);
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