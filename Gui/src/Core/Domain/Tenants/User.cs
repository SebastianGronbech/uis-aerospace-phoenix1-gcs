namespace Core.Domain.Tenants;

public class User
{
    public Guid Id { get; protected set; }
    public string Name { get; private set; }
    public Email Email { get; private set; }
    public UserRole Role { get; private set; }

    public DateTimeOffset CreatedAt { get; protected set; }
    public DateTimeOffset? UpdatedAt { get; private set; }
    public DateTimeOffset? DeletedAt { get; protected set; }

    public User(string name, Email email)
    {
        if (string.IsNullOrWhiteSpace(name))
        {
            throw new ArgumentException("Name cannot be empty", nameof(name));
        }

        Id = Guid.NewGuid();
        Name = name;
        Email = email;
        Role = UserRole.Spectator;
        CreatedAt = DateTimeOffset.UtcNow;
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