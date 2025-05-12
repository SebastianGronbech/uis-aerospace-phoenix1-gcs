import React from "react";
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
import ChartCard from "../components/ChartCard";
import ModuleCard from "../components/ModuleCard";
import UsageBar from "../components/UsageBar";

ChartJS.register(
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend
);

const dummyData = {
    labels: Array.from({ length: 10 }, (_, i) => i.toString()),
    datasets: [
        {
            label: "Value",
            data: [12, 19, 3, 5, 2, 3, 7, 10, 8, 6],
            borderColor: "#3b82f6",
            backgroundColor: "rgba(59, 130, 246, 0.2)",
        },
    ],
};

const sendtData = {
    labels: Array.from({ length: 10 }, (_, i) => `Time ${i}`), // Or your actual time labels
    datasets: [
        {
            label: "Ground Module Sent",
            data: [10, 12, 15, 13, 16, 18, 20, 17, 19, 22], // Example data for ground sent
            borderColor: "#3b82f6", // Blue
            backgroundColor: "rgba(59, 130, 246, 0.2)",
            tension: 0.1,
        },
        {
            label: "Rocket Module Sent",
            data: [8, 9, 11, 10, 13, 14, 15, 12, 14, 17], // Example data for rocket sent
            borderColor: "#10b981", // Green
            backgroundColor: "rgba(16, 185, 129, 0.2)",
            tension: 0.1,
        },
    ],
};

const groundStatuses = [
    { label: "Running", isOn: true },
    { label: "Not Frozen Indicator", isOn: true },
    { label: "Node Indicator", isOn: true },
    { label: "canRx not full", isOn: true },
    { label: "canTx not full", isOn: true },
    { label: "serial tx not full", isOn: false }, // Example of an "off" status
    { label: "serial rx not full", isOn: true },
];

const chartOptions = {
    responsive: true,
    maintainAspectRatio: false, // Allow charts to fill container height
    plugins: {
        legend: {
            position: "top",
        },
        title: {
            display: false,
        },
    },
    scales: {
        x: {
            ticks: {
                color: "#ffffff",
            },
            grid: {
                color: "rgba(255, 255, 255, 0.1)", // Darker grid lines
            },
        },
        y: {
            ticks: {
                color: "#ffffff",
            },
            grid: {
                color: "rgba(255, 255, 255, 0.1)", // Darker grid lines
            },
        },
    },
};

export default function TelemetryPage() {
    return (
        <div className="p-6 space-y-6 bg-white dark:bg-gray-900 text-gray-800 dark:text-white flex flex-col h-full">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 flex-grow">
                <div className="space-y-6 md:col-span-2 flex flex-col">
                    <ChartCard
                        title={"RSSI - Received Signal Strength Indicator"}
                        chartData={dummyData}
                        chartOptions={chartOptions}
                    />

                    <div className="grid grid-cols-1 grid-rows-4 md:grid-rows-2 md:grid-cols-2 gap-6 flex-grow">
                        <ChartCard
                            title={"SNR - Signal to Noise Ratio"}
                            chartData={dummyData}
                            chartOptions={chartOptions}
                        />

                        <ChartCard
                            title={"PL - Packet Loss"}
                            chartData={dummyData}
                            chartOptions={chartOptions}
                        />

                        <ChartCard
                            title={"Sent"}
                            chartData={sendtData}
                            chartOptions={chartOptions}
                        />

                        <ChartCard
                            title={"Mottatt"}
                            chartData={sendtData}
                            chartOptions={chartOptions}
                        />
                    </div>
                </div>

                <div className="grid md:grid-cols-2 gap-6 md:grid-rows-[auto_1fr]">
                    <ModuleCard
                        moduleTitle={"Ground Module"}
                        packetStatsData={sendtData}
                        onReset={() => console.log("Reset Ground")}
                        statusItems={groundStatuses}
                    />

                    <ModuleCard
                        moduleTitle={"Rocket Module"}
                        packetStatsData={sendtData}
                        onReset={() => console.log("Reset Ground")}
                        statusItems={groundStatuses}
                    />

                    <div className="md:col-span-2">
                        <UsageBar
                            title={"Telemetrilink Utnyttelse [%]"}
                            usagePercentage={75}
                        />
                    </div>
                </div>
            </div>
        </div>
    );
}
