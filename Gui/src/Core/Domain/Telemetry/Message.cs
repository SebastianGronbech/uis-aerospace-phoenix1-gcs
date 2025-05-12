namespace Gui.Core.Domain.Telemetry;

public class Message
{
    public int Id { get; private set; }
    public string Name { get; private set; }
    public IReadOnlyList<Signal> Signals { get; private set; }

    public Message(int id, string name, IEnumerable<Signal> signals)
    {
        Id = id;
        Name = name;
        Signals = signals.ToList().AsReadOnly();
    }
}