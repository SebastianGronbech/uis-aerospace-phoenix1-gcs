using Gui.Core.Domain.Tenants;
using Gui.Infrastructure.Persistence;

namespace Gui.Infrastructure.Repositories;

public class UserRepository : IUserRepository
{
    private readonly ApplicationContext _context;

    public UserRepository(ApplicationContext context)
    {
        _context = context;
    }

    public void Add(User user)
    {
        _context.Users.AddAsync(user);
    }
}
