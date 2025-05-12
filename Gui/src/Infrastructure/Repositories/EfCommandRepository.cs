using Gui.Core.CommandAggregate;
using Gui.Infrastructure.Persistence;
using Microsoft.EntityFrameworkCore;

namespace Gui.Infrastructure.Repositories
{
    public class EfCommandRepository : ICommandRepository
    {
        private readonly ApplicationContext _context;

        public EfCommandRepository(ApplicationContext context)
        {
            _context = context;
        }

        public async Task<(int CanId, string Payload)?> FindByPublicIdAsync(string publicId, CancellationToken cancellationToken)
        {
            var entity = await _context.Commands
                .FirstOrDefaultAsync(c => c.PublicIdentifier == publicId, cancellationToken);

            if (entity == null)
                return null;

            return (entity.Id, entity.Payload); 
        }
    }
}
