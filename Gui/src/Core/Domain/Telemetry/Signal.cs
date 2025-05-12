namespace Gui.Core.Domain.Telemetry;

public class Signal
{
    public string Name { get; }
    public int StartBit { get; }
    public int Length { get; }
    public bool IsSigned { get; }
    public string Type { get; }

    public Signal(string name, int startBit, int length, bool isSigned, string type)
    {
        Name = name;
        StartBit = startBit;
        Length = length;
        IsSigned = isSigned;
        Type = type;
    }
}