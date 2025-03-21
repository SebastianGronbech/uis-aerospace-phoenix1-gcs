using Gui.Core.SharedKernel;
using MediatR;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore;

namespace Gui.Infrastructure.Persistence
{
    public class ApplicationContext : IdentityDbContext<IdentityUser>
    {
        private readonly IMediator _mediator;

        public ApplicationContext(DbContextOptions options, IMediator mediator)
            : base(options)
        {
            _mediator = mediator;
        }

        //public DbSet<IdentityUser> Users { get; set; } = null!;

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);
            // Additional configuration can go here.
        }

        public override async Task<int> SaveChangesAsync(CancellationToken cancellationToken = new CancellationToken())
        {
            var result = await base.SaveChangesAsync(cancellationToken).ConfigureAwait(false);

            if (_mediator != null)
            {
                var entitiesWithEvents = ChangeTracker.Entries<BaseEntity>()
                    .Select(e => e.Entity)
                    .Where(e => e.Events.Any())
                    .ToArray();

                foreach (var entity in entitiesWithEvents)
                {
                    var events = entity.Events.ToArray();
                    entity.Events.Clear();
                    foreach (var domainEvent in events)
                    {
                        await _mediator.Publish(domainEvent, cancellationToken).ConfigureAwait(false);
                    }
                }
            }

            return result;
        }

        public override int SaveChanges() => SaveChangesAsync().GetAwaiter().GetResult();
    }
}