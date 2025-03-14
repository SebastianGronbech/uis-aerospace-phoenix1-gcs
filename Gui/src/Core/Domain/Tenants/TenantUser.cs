namespace Core.Domain.Tenants;

public class TenantUser
{
    public Guid Id { get; protected set; }
    public Guid TenantId { get; protected set; }
    public TenantUserRole Role { get; private set; }

    public DateTimeOffset CreatedAt { get; protected set; }
    public DateTimeOffset? UpdatedAt { get; private set; }
    public DateTimeOffset? DeletedAt { get; protected set; }

    public TenantUser(Guid tenantId)
    {
        Id = Guid.NewGuid();
        TenantId = tenantId;
        Role = TenantUserRole.Spectator;
        CreatedAt = DateTimeOffset.UtcNow;
    }

    public void SetRole(TenantUserRole role)
    {
        if (Role == role)
        {
            return;
        }

        Role = role;
    }
}