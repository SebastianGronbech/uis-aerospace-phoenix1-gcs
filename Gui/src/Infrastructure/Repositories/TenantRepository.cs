using Gui.Core.Domain.Tenants;
using Gui.Infrastructure.Persistence;
using Microsoft.EntityFrameworkCore;

namespace Gui.Infrastructure.Repositories;

public class TenantRepository : ITenantRepository
{
    private readonly ApplicationContext _context;

    public TenantRepository(ApplicationContext context)
    {
        _context = context;
    }
    public Task<List<Tenant>> GetAllAsync(CancellationToken cancellationToken)
    {
        return _context.Tenants.ToListAsync(cancellationToken);
    }

    public async Task<Tenant?> GetByIdAsync(Guid id, CancellationToken cancellationToken = default)
    {
        return await _context.Tenants
            .Include(t => t.Users)
            .FirstOrDefaultAsync(t => t.Id == id, cancellationToken);
    }

    public Task<Tenant?> GetByNameAsync(string name, CancellationToken cancellationToken = default)
    {
        return _context.Tenants
            .Include(t => t.Users)
            .FirstOrDefaultAsync(t => t.Name == name, cancellationToken);
    }

    public void Add(Tenant tenant)
    {
        _context.Tenants.AddAsync(tenant);
    }

    public void Remove(Tenant tenant)
    {
        _context.Tenants.Remove(tenant);
    }
}
