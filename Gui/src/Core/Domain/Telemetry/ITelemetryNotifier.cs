namespace Gui.Core.Domain.Telemetry;

public interface ITelemetryNotifier
{
    Task BroadcastTelemetryAsync(object telemetryData);
}