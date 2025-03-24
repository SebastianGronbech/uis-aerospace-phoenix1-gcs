using Gui.Core.SharedKernel;

namespace Gui.Core.Domain.Units;

public class Unit : BaseEntity
{
    public Guid Id { get; protected set; }
    public string Name { get; private set; }


    public DateTimeOffset CreatedAt { get; }
    public DateTimeOffset? UpdatedAt { get; private set; }
    public DateTimeOffset? DeletedAt { get; protected set; }

    private Unit(Guid id, string name)
    {
        Id = id;
        Name = name;
        CreatedAt = DateTimeOffset.UtcNow;
    }
}
