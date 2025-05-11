namespace Gui.Core.Domain.Telemetry;

public class Signal
{
    public string Name { get; private set; }
    public int StartBit { get; private set; }
    public int Length { get; private set; }
    public bool IsSigned { get; private set; }
    public string Type { get; private set; }

    public Signal(string name, int startBit, int length, bool isSigned, string type)
    {
        Name = name;
        StartBit = startBit;
        Length = length;
        IsSigned = isSigned;
        Type = type;
    }
}
