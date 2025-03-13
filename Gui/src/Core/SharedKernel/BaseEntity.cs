namespace Core.SharedKernel;

public abstract class BaseEntity
{
    public List<BaseDomainEvent> Events = new();
}