using Gui.Core.Domain.Telemetry;
using InfluxDB.Client;
using InfluxDB.Client.Api.Domain;
using InfluxDB.Client.Writes;

namespace Gui.Infrastructure.Repositories;

public class SignalMeasurementRepository : ISignalMeasurementRepository, IDisposable
{
    private readonly InfluxDBClient _influxDBClient;
    private readonly string _bucket;
    private readonly string _org;

    public SignalMeasurementRepository(InfluxDBClient influxDBClient, string bucket, string org)
    {
        _influxDBClient = influxDBClient;
        _bucket = bucket;
        _org = org;
    }

    public Task AddSignalMeasurementsAsync(IEnumerable<SignalMeasurement> signalMeasurements)
    {
        var writeApi = _influxDBClient.GetWriteApiAsync();
        // var pointList = new List<PointData>();

        // foreach (var signalMeasurement in signalMeasurements)
        // {
        //     var point = PointData.Measurement(signalMeasurement.Name)
        //         .Tag("messageId", signalMeasurement.MessageId.ToString())
        //         .Field("value", signalMeasurement.Value)
        //         .Timestamp(signalMeasurement.Timestamp, WritePrecision.Ns);

        //     pointList.Add(point);
        // }
        // return writeApi.WritePointsAsync(pointList, _bucket, _org);

        var points = signalMeasurements.Select(signalMeasurement =>
            PointData.Measurement(signalMeasurement.Name)
                .Tag("messageId", signalMeasurement.MessageId.ToString())
                .Field("value", signalMeasurement.Value)
                .Timestamp(signalMeasurement.Timestamp, WritePrecision.Ns)).ToList();

        return writeApi.WritePointsAsync(points, _bucket, _org);
    }

    public void Dispose()
    {
        throw new NotImplementedException();
    }
}
