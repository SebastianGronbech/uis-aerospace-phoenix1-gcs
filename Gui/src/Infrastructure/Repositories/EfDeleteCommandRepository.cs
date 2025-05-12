using Gui.Core.CommandAggregate;
using Gui.Infrastructure.Persistence;
using Microsoft.EntityFrameworkCore;

namespace Gui.Infrastructure.Repositories
{
    public class EfDeleteCommandRepository : IDeleteCommandRepository
    {
        private readonly ApplicationContext _context;

        public EfDeleteCommandRepository(ApplicationContext context)
        {
            _context = context;
        }

        public async Task<bool> DeleteByPublicIdAsync(string publicId, CancellationToken cancellationToken)
        {
            var entity = await _context.Commands
                .FirstOrDefaultAsync(c => c.PublicIdentifier == publicId, cancellationToken);

            if (entity == null)
                return false;

            _context.Commands.Remove(entity);
            await _context.SaveChangesAsync(cancellationToken);
            return true;
        }
    }
}
