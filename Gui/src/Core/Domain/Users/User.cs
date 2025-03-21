using Gui.Core.SharedKernel;
using MediatR;

namespace Gui.Core.Domain.Users;

public class User : BaseEntity
{
    public Guid Id { get; protected set; }
    public string Name { get; private set; }

    private readonly HashSet<UnitAccess> _unitAccesses = new();
    public IReadOnlyCollection<UnitAccess> UnitAccesses => _unitAccesses;

    public DateTimeOffset CreatedAt { get; }
    public DateTimeOffset? UpdatedAt { get; private set; }
    public DateTimeOffset? DeletedAt { get; protected set; }

    private User(Guid id, string name)
    {
        Id = id;
        Name = name;
        CreatedAt = DateTimeOffset.UtcNow;
    }

    internal static User Create(Guid id, string name)
    {
        if (id == Guid.Empty)
        {
            throw new ArgumentException("Id cannot be empty", nameof(id));
        }

        if (string.IsNullOrWhiteSpace(name))
        {
            throw new ArgumentException("Name cannot be empty", nameof(name));
        }

        return new User(id, name);
    }

    public void AddAccess(Guid unitId)
    {
        var unitAccess = UnitAccess.Create(Id, unitId);
        if (!_unitAccesses.Add(unitAccess))
        {
            throw new InvalidOperationException($"Access to Unit with ID {unitId} already exists");
        }

        UpdatedAt = DateTimeOffset.UtcNow;
    }

    public void AddRole(Guid unitId, UserRole role)
    {
        var unitAccess = _unitAccesses.FirstOrDefault(u => u.UnitId == unitId);
        if (unitAccess == null)
        {
            unitAccess = UnitAccess.Create(Id, unitId);
        }

        unitAccess.SetRole(role);
        UpdatedAt = DateTimeOffset.UtcNow;
    }
}