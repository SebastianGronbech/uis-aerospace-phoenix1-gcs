namespace Gui.Core.Domain.Tenants;

public interface ITenantRepository
{
    Task<List<Tenant>> GetAllAsync(CancellationToken cancellationToken);
    Task<Tenant?> GetByIdAsync(Guid id, CancellationToken cancellationToken);
    Task<Tenant?> GetByNameAsync(string name, CancellationToken cancellationToken);
    Task AddAsync(Tenant tenant, CancellationToken cancellationToken);
    Task UpdateAsync(Tenant tenant, CancellationToken cancellationToken);
    Task DeleteAsync(Tenant tenant, CancellationToken cancellationToken);
}