namespace Gui.Core.Domain.Tenants;

public class User
{
    public Guid Id { get; protected set; }
    public UserRole Role { get; private set; }

    public DateTimeOffset CreatedAt { get; set; }
    public DateTimeOffset? UpdatedAt { get; private set; }
    public DateTimeOffset? DeletedAt { get; protected set; }

    private User(Guid id)
    {
        Id = id;
        Role = UserRole.Spectator;
        CreatedAt = DateTimeOffset.UtcNow;
    }

    internal static User Create(Guid id)
    {
        if (id == Guid.Empty)
        {
            throw new ArgumentException("Id cannot be empty", nameof(id));
        }

        return new User(id);
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