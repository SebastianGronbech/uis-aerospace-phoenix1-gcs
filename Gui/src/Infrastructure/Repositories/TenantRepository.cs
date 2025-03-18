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

    public void Add(Tenant tenant)
    {
        _context.Tenants.AddAsync(tenant);
        // return _context.SaveChangesAsync(cancellationToken);
    }

    public Task DeleteAsync(Tenant tenant, CancellationToken cancellationToken)
    {
        throw new NotImplementedException();
    }

    public Task<List<Tenant>> GetAllAsync(CancellationToken cancellationToken)
    {
        return _context.Tenants.ToListAsync(cancellationToken);
    }

    public async Task<Tenant?> GetByIdAsync(Guid id, CancellationToken cancellationToken = default)
    {
        return await _context.Tenants.Include(x => x.Users)
                                        .FirstOrDefaultAsync(x => x.Id == id, cancellationToken);
    }

    public Task<Tenant?> GetByNameAsync(string name, CancellationToken cancellationToken = default)
    {
        return _context.Tenants.FirstOrDefaultAsync(x => x.Name == name, cancellationToken);
    }

    public void Update(Tenant tenant)
    {
        _context.Tenants.Update(tenant);
    }
}
