namespace Gui.Core.Domain.Telemetry;

public class SignalMeasurement
{
    public string Name { get; private set; }

    // Source
    public int MessageId { get; private set; }
    public object Value { get; private set; }

    public DateTimeOffset Timestamp { get; private set; }
    public SignalMeasurement(string name, int messageId, object value, DateTimeOffset timestamp)
    {
        Name = name;
        MessageId = messageId;
        Value = value;
        Timestamp = timestamp;
    }
}