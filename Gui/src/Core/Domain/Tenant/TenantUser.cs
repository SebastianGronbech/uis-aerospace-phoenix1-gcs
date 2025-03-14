using Core.SharedKernel;

namespace Core.Domain.Tenant;

public class TenantUser : BaseEntity
{
    public Guid Id { get; protected set; }
    public Guid TenantId { get; protected set; }

    public DateTimeOffset CreatedAt { get; protected set; }
    public DateTimeOffset? UpdatedAt { get; private set; }
    public DateTimeOffset? DeletedAt { get; protected set; }

    public TenantUser(Guid tenantId)
    {
        Id = Guid.NewGuid();
        TenantId = tenantId;
        CreatedAt = DateTimeOffset.UtcNow;
    }
}