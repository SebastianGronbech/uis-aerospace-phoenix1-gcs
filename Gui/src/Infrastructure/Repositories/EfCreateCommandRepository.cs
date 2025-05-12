using Gui.Core.CommandAggregate;
using Gui.Infrastructure.Entities;
using Gui.Infrastructure.Persistence;

namespace Gui.Infrastructure.Repositories
{
    public class EfCreateCommandRepository : ICreateCommandRepository
    {
        private readonly ApplicationContext _context;

        public EfCreateCommandRepository(ApplicationContext context)
        {
            _context = context;
        }

        public async Task<int> CreateAsync(int id, string publicId, string payload, CancellationToken cancellationToken)
        {
            var entity = new CommandEntity
            {
                Id = id,
                PublicIdentifier = publicId,
                Payload = payload
            };

            _context.Commands.Add(entity);
            await _context.SaveChangesAsync(cancellationToken);

            return entity.Id;
        }
    }
}
