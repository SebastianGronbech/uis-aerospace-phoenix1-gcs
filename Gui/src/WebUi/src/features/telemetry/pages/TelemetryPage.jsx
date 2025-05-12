import React, { useState, useEffect } from "react";
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
import { useTelemetryHub } from "../hooks/useTelemetryHub";
import SignalValuesDisplay from "../components/SignalValuesDisplay";

ChartJS.register(
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend
);

const MAX_POINTS = 300;

const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
        legend: { position: "top" },
        title: { display: false },
    },
    scales: {
        x: {
            ticks: { color: "#ffffff" },
            grid: { color: "rgba(255, 255, 255, 0.1)" },
        },
        y: {
            ticks: { color: "#ffffff" },
            grid: { color: "rgba(255, 255, 255, 0.1)" },
        },
    },
};

export default function TelemetryPage() {
    const { telemetryData, connected } = useTelemetryHub();

    const [labels, setLabels] = useState([]);
    const [rssiData, setRssiData] = useState([]);
    const [snrData, setSnrData] = useState([]);
    const [plData, setPlData] = useState([]);

    useEffect(() => {
        if (!telemetryData) return;

        const timestamp = new Date().toLocaleTimeString();
        setLabels(prev => [...prev.slice(-MAX_POINTS + 1), timestamp]);

        setRssiData(prev =>
            telemetryData.Rssi !== undefined
                ? [...prev.slice(-MAX_POINTS + 1), telemetryData.Rssi]
                : prev
        );

        setSnrData(prev =>
            telemetryData.Snr !== undefined
                ? [...prev.slice(-MAX_POINTS + 1), telemetryData.Snr]
                : prev
        );

        setPlData(prev =>
            telemetryData.PacketLoss !== undefined
                ? [...prev.slice(-MAX_POINTS + 1), telemetryData.PacketLoss]
                : prev
        );
    }, [telemetryData]);

    const rocketStatuses = telemetryData
        ? [
              { label: "Running", isOn: telemetryData.IsRunning },
              { label: "Not Frozen Indicator", isOn: !telemetryData.IsFrozen },
              { label: "Node Indicator", isOn: telemetryData.IsNode },
              { label: "canRx not full", isOn: !telemetryData.IsCanRxFull },
              { label: "canTx not full", isOn: !telemetryData.IsCanTxFull },
              { label: "serial tx not full", isOn: !telemetryData.IsSerialTxFull },
              { label: "serial rx not full", isOn: !telemetryData.IsSerialRxFull },
          ]
        : [];

    const groundStatuses = [
        { label: "Running", isOn: true },
        { label: "Not Frozen Indicator", isOn: true },
        { label: "Node Indicator", isOn: true },
        { label: "canRx not full", isOn: true },
        { label: "canTx not full", isOn: true },
        { label: "serial tx not full", isOn: false },
        { label: "serial rx not full", isOn: true },
    ];

    return (
        <div className="p-6 space-y-6 bg-white dark:bg-gray-900 text-gray-800 dark:text-white flex flex-col h-full">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 flex-grow">
                <div className="space-y-6 md:col-span-2 flex flex-col">
                    <ChartCard
                        title="Signal Quality (RSSI & SNR)"
                        chartData={{
                            labels,
                            datasets: [
                                {
                                    label: "RSSI",
                                    data: rssiData,
                                    borderColor: "#3b82f6",
                                    backgroundColor: "rgba(59, 130, 246, 0.2)",
                                    tension: 0.1,
                                },
                                {
                                    label: "SNR",
                                    data: snrData,
                                    borderColor: "#10b981",
                                    backgroundColor: "rgba(16, 185, 129, 0.2)",
                                    tension: 0.1,
                                },
                            ],
                        }}
                        chartOptions={chartOptions}
                    />

                    <div className="grid grid-cols-1 grid-rows-4 md:grid-rows-2 md:grid-cols-2 gap-6 flex-grow">
                        <ChartCard
                            title="Packet Loss"
                            chartData={{
                                labels,
                                datasets: [
                                    {
                                        label: "Packet Loss",
                                        data: plData,
                                        borderColor: "#f59e0b",
                                        backgroundColor: "rgba(245, 158, 11, 0.2)",
                                        tension: 0.1,
                                    },
                                ],
                            }}
                            chartOptions={chartOptions}
                        />

                        <ChartCard title="Sent" chartData={{ labels, datasets: [] }} chartOptions={chartOptions} />
                        <ChartCard title="Mottatt" chartData={{ labels, datasets: [] }} chartOptions={chartOptions} />
                    </div>
                </div>

                <div className="grid md:grid-cols-2 gap-6 md:grid-rows-[auto_1fr]">
                    <ModuleCard
                        moduleTitle="Ground Module"
                        packetStatsData={{}}
                        onReset={() => console.log("Reset Ground")}
                        statusItems={groundStatuses}
                    />

                    <ModuleCard
                        moduleTitle="Rocket Module"
                        packetStatsData={{}}
                        onReset={() => console.log("Reset Rocket")}
                        statusItems={rocketStatuses}
                    />

                    <div className="md:col-span-2">
                        <UsageBar title="Telemetrilink Utnyttelse [%]" usagePercentage={75} />
                    </div>

                    <div className="md:col-span-2 space-y-2">
                        <div className="text-sm text-gray-400">
                            {connected ? "🟢 Connected to telemetry" : "🕓 Connecting..."}
                        </div>
                        {telemetryData ? (
                            <SignalValuesDisplay data={telemetryData} />
                        ) : (
                            <div className="text-gray-500">Waiting for telemetry...</div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
