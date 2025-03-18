namespace Gui.Core.Domain.Tenants;

public interface ITenantRepository
{
    Task<List<Tenant>> GetAllAsync(CancellationToken cancellationToken);
    Task<Tenant?> GetByIdAsync(Guid id, CancellationToken cancellationToken = default);
    Task<Tenant?> GetByNameAsync(string name, CancellationToken cancellationToken = default);
    void Add(Tenant tenant);
    void Update(Tenant tenant);
    Task DeleteAsync(Tenant tenant, CancellationToken cancellationToken);
}