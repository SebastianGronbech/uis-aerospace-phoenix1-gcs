using Gui.Core.Domain.Users;
using Gui.Infrastructure.Persistence;
using Microsoft.EntityFrameworkCore;

namespace Gui.Infrastructure.Repositories;

public class UserRepository : IUserRepository
{
    private readonly ApplicationContext _context;

    public UserRepository(ApplicationContext context)
    {
        _context = context;
    }

    public async Task<List<User>> GetAllAsync(CancellationToken cancellationToken)
    {
        return await _context.Userss
            // .Include(u => u.Accesses)
            .ToListAsync(cancellationToken);
    }

    public async Task<User?> GetByIdAsync(Guid id, CancellationToken cancellationToken = default)
    {
        return await _context.Userss
            .Include(u => u.UnitAccesses)
            .FirstOrDefaultAsync(u => u.Id == id, cancellationToken);
    }

    public void Add(User user)
    {
        _context.Userss.AddAsync(user);
    }

    public void Remove(User user)
    {
        _context.Userss.Remove(user);
    }
}
