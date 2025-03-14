namespace Core.Domain.Tenant;

public class Tenant
{
    public Guid Id { get; protected set; }
    public string Name { get; private set; }

    private List<TenantUser> _tenantUsers = new();
    public IReadOnlyCollection<TenantUser> TenantUsers => _tenantUsers.AsReadOnly();

    public DateTimeOffset CreatedAt { get; protected set; }
    public DateTimeOffset? UpdatedAt { get; private set; }
    public DateTimeOffset? DeletedAt { get; protected set; }

    public Tenant(Guid id, string name)
    {
        Id = id;
        Name = name;
        CreatedAt = DateTimeOffset.UtcNow;
    }

    public void AddTenantUser(Guid tenantUserId)
    {
        _tenantUsers.Add(new TenantUser(tenantUserId));
    }
}