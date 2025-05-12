namespace Gui.Core.Domain.Telemetry;

public interface ISignalMeasurementRepository
{
    Task AddSignalMeasurementsAsync(IEnumerable<SignalMeasurement> signalMeasurements);
}