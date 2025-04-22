import { Line } from "react-chartjs-2";
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend,
} from "chart.js";

ChartJS.register(
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend
);

export const TelemetryChart = ({ telemetryData }) => {
    const chartData = {
        labels: telemetryData.map((data) => data.timestamp),
        datasets: [
            {
                label: "Speed",
                data: telemetryData.map((data) => data.speed),
                borderColor: "rgba(75, 192, 192, 1)",
                backgroundColor: "rgba(75, 192, 192, 0.2)",
            },
            {
                label: "RPM",
                data: telemetryData.map((data) => data.rpm),
                borderColor: "rgba(153, 102, 255, 1)",
                backgroundColor: "rgba(153, 102, 255, 0.2)",
            },
        ],
    };

    return (
        <div>
            <h2 className="text-xl font-semibold mb-4">Telemetry Chart</h2>
            <Line data={chartData} />
        </div>
    );
};
// export default TelemetryChart;
