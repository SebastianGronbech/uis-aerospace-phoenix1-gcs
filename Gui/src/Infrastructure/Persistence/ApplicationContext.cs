using Gui.Core.Domain.Users;
using Gui.Core.SharedKernel;
using MediatR;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Logging;

namespace Gui.Infrastructure.Persistence;

public class ApplicationContext : DbContext, IUnitOfWork
{
    private readonly IMediator _mediator;
    private readonly ILogger<ApplicationContext> _logger;
    public ApplicationContext(DbContextOptions configuration, IMediator mediator, ILogger<ApplicationContext> logger) : base(configuration)
    {
        _mediator = mediator;
        _logger = logger;
    }

    public DbSet<User> Users { get; set; } = null!;

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        base.OnModelCreating(modelBuilder);

        // modelBuilder.Entity<Tenant>()
        //     .HasKey(t => t.Id);

        // modelBuilder.Entity<Tenant>()
        //     .Property(t => t.Name)
        //     .IsRequired();

        // modelBuilder.Entity<Tenant>()
        //     .HasMany(t => t.Users)
        //     .WithOne()
        //     .HasForeignKey(u => u.TenantId)
        //     .OnDelete(DeleteBehavior.Cascade);

        // modelBuilder.Entity<User>()
        //     .Navigation(u => u.Tenant)
        //     .UsePropertyAccessMode(PropertyAccessMode.Property);

        // modelBuilder.Entity<User>()
        //     .Property(u => u.UpdatedAt)
        //     .IsConcurrencyToken();

    }

    public override async Task<int> SaveChangesAsync(CancellationToken cancellationToken = new CancellationToken())
    {
        // Console.WriteLine(ChangeTracker.DebugView.LongView);
        // _logger.LogDebug("Change Tracker State:\n{State}", ChangeTracker.DebugView.LongView);
        _logger.LogDebug(ChangeTracker.DebugView.LongView);

        int result;

        try
        {
            result = await base.SaveChangesAsync(cancellationToken).ConfigureAwait(false);
        }
        catch (DbUpdateConcurrencyException ex)
        {
            // Iterate over the entries that caused the exception
            foreach (var entry in ex.Entries)
            {
                // Get the entity type involved in the exception
                var entityType = entry.Entity.GetType().Name;

                // Get the state of the entity (e.g., unchanged, modified, etc.)
                var entityState = entry.State;

                // Log the original values of the entity before the update attempt
                var originalValues = entry.OriginalValues;
                var currentValues = entry.CurrentValues;

                var originalEntityValues = originalValues.Properties.ToDictionary(p => p.Name, p => originalValues[p]);
                var currentEntityValues = currentValues.Properties.ToDictionary(p => p.Name, p => currentValues[p]);

                Console.WriteLine($"[ERROR]Concurrency conflict detected on {entityType}. Original values: {string.Join(", ", originalEntityValues.Select(kvp => $"{kvp.Key}: {kvp.Value}"))}. Current values: {string.Join(", ", currentEntityValues.Select(kvp => $"{kvp.Key}: {kvp.Value}"))}");

                // Optionally, you can handle the exception in different ways, such as prompting the user to resolve the conflict, applying a retry logic, etc.
            }

            throw; // Rethrow or handle as needed
        }

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