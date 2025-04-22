import { useState, useEffect } from "react";
import { useTelemetryHub } from "../hooks/useTelemetryHub";
import { TelemetryChart } from "./TelemetryChart";

export const EngineDashboard = () => {
    const { telemetryData, error, isConnected } = useTelemetryHub();
    const [chartData, setChartData] = useState([]);

    useEffect(() => {
        if (telemetryData) {
            const newChartData = telemetryData.map((data) => ({
                time: data.time,
                value: data.value,
            }));
            setChartData((prevData) => [...prevData, ...newChartData]);
        }
    }, [telemetryData]);

    return (
        <div className="p-4">
            <h1 className="text-2xl font-bold mb-4">
                Engine Dashboard{" "}
                {isConnected ? "🟢 Connected" : "🔴 Disconnected"}
            </h1>

            {error && <p className="text-red-500">{error}</p>}

            {isConnected ? (
                <div>
                    {/* <h2 className="text-xl font-semibold">Telemetry Data</h2>
                    <pre className="bg-gray-100 p-4 rounded">
                        {JSON.stringify(telemetryData, null, 2)}
                    </pre> */}

                    <TelemetryChart telemetryData={chartData} />
                </div>
            ) : (
                <p className="text-gray-500">Connecting to telemetry hub...</p>
            )}
        </div>
    );
};
