using Gui.Core.Domain.Tenants;
using Gui.Core.SharedKernel;
using MediatR;
using Microsoft.EntityFrameworkCore;

namespace Gui.Infrastructure.Persistence;

public class ApplicationContext : DbContext, IUnitOfWork
{
    private readonly IMediator _mediator;
    public ApplicationContext(DbContextOptions configuration, IMediator mediator) : base(configuration)
    {
        _mediator = mediator;
    }

    public DbSet<Tenant> Tenants { get; set; } = null!;

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        base.OnModelCreating(modelBuilder);
    }

    public override async Task<int> SaveChangesAsync(CancellationToken cancellationToken = new CancellationToken())
    {
        var result = await base.SaveChangesAsync(cancellationToken).ConfigureAwait(false);

        // Ignore events if no dispatcher provided
        if (_mediator == null) return result;

        // Dispatch domain events only if save was successful
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

        return result;
    }

    public override int SaveChanges() => SaveChangesAsync().GetAwaiter().GetResult();
}