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
    // Format timestamps to readable strings (HH:MM:SS)
    const formatTime = (date) => {
        if (!date) return "";
        const hours = String(date.getHours()).padStart(2, "0");
        const minutes = String(date.getMinutes()).padStart(2, "0");
        const seconds = String(date.getSeconds()).padStart(2, "0");
        return `${hours}:${minutes}:${seconds}`;
    };

    const processedData = telemetryData?.map((data) => ({
        ...data,
        timestamp: new Date(data.timestamp),
    }));

    const chartData = {
        // Use formatted time strings for labels instead of Date objects
        labels: processedData?.map((data) => formatTime(data.timestamp)),
        datasets: [
            {
                label: "Speed",
                data: processedData?.map((data) => data.speed),
                borderColor: "rgba(75, 192, 192, 1)",
                backgroundColor: "rgba(75, 192, 192, 0.2)",
            },
            {
                label: "RPM",
                data: processedData?.map((data) => data.rpm),
                borderColor: "rgba(153, 102, 255, 1)",
                backgroundColor: "rgba(153, 102, 255, 0.2)",
            },
        ],
    };

    const options = {
        scales: {
            x: {
                title: {
                    display: true,
                    text: "Time (HH:MM:SS)",
                },
                // Display fewer ticks if there are many data points
                ticks: {
                    maxTicksLimit: 10,
                    autoSkip: true,
                },
            },
            // y: {
            //     beginAtZero: true,
            //     title: {
            //         display: true,
            //         text: "Value",
            //     },
            // },
        },
        plugins: {
            tooltip: {
                callbacks: {
                    title: function (context) {
                        // You can create a more detailed tooltip label here
                        const index = context[0].dataIndex;
                        const date = processedData?.[index]?.timestamp;
                        if (!date) return "";
                        return `${date.toLocaleDateString()} ${formatTime(
                            date
                        )}`;
                    },
                },
            },
        },
        responsive: true,
        maintainAspectRatio: false,
    };

    return (
        <div className="h-96">
            <h2 className="text-xl font-semibold mb-4">Telemetry Chart</h2>
            <Line data={chartData} options={options} />
        </div>
    );
};
