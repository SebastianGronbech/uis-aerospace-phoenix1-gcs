namespace Gui.Core.Domain.Telemetry;

public class Message
{
    public int Id { get; }
    public string Name { get; }
    public IReadOnlyList<Signal> Signals { get; }

    public Message(int id, string name, IReadOnlyList<Signal> signals)
    {
        Id = id;
        Name = name;
        Signals = signals;
    }
}