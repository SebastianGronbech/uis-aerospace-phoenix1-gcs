// src/features/dashboard/components/LeftPanel.jsx
import React from "react";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip as ChartTooltip,
  Legend,
} from "chart.js";
import { Line } from "react-chartjs-2";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  ChartTooltip,
  Legend
);

export default function LeftPanel({ telemetryFields, telemetryHistory }) {
  const { Altitude, TotalVelocity, Rssi } = telemetryFields || {};

  const labels = telemetryHistory.map((p) => p.timestamp);
  const altitudeData = telemetryHistory.map((p) => p.Altitude);
  const velocityData = telemetryHistory.map((p) => p.TotalVelocity);
  const rssiData = telemetryHistory.map((p) => p.Rssi);

  const commonOptions = {
    responsive: true,
    maintainAspectRatio: false,
    animation: { duration: 0 },
    scales: {
      x: {
        ticks: { color: "#ccc", maxRotation: 45, minRotation: 45 },
        grid: { color: "#444" },
      },
      y: {
        ticks: { color: "#ccc" },
        grid: { color: "#444" },
      },
    },
    plugins: {
      legend: { display: false },
      tooltip: {
        backgroundColor: "#333",
        titleColor: "#fff",
        bodyColor: "#fff",
      },
    },
  };

  const altitudeChartData = {
    labels,
    datasets: [
      {
        label: "Altitude",
        data: altitudeData,
        borderColor: "#00e676",
        borderWidth: 2,
        pointRadius: 0,
        tension: 0.2,
      },
    ],
  };

  const velocityChartData = {
    labels,
    datasets: [
      {
        label: "Total Velocity",
        data: velocityData,
        borderColor: "#2979ff",
        borderWidth: 2,
        pointRadius: 0,
        tension: 0.2,
      },
    ],
  };

  const rssiChartData = {
    labels,
    datasets: [
      {
        label: "RSSI",
        data: rssiData,
        borderColor: "#ff1744",
        borderWidth: 2,
        pointRadius: 0,
        tension: 0.2,
      },
    ],
  };

  return (
    <aside className="flex-none w-1/4 bg-white dark:bg-gray-800 border-r border-gray-300 dark:border-gray-600 p-3 flex flex-col gap-4 overflow-hidden">
      {/* Altitude Value + Chart */}
      <div className="flex flex-col flex-1 bg-gray-900 text-white rounded-md p-2">
        <div className="flex justify-between items-center mb-1">
          <span className="text-sm font-medium">Altitude:</span>
          <span>{Altitude != null ? `${Altitude.toFixed(2)} m` : "—"}</span>
        </div>
        <div className="flex-1 bg-gray-800 rounded-md p-1">
          <Line data={altitudeChartData} options={commonOptions} />
        </div>
      </div>

      {/* Total Velocity Value + Chart */}
      <div className="flex flex-col flex-1 bg-gray-900 text-white rounded-md p-2">
        <div className="flex justify-between items-center mb-1">
          <span className="text-sm font-medium">Total Velocity:</span>
          <span>{TotalVelocity != null ? `${TotalVelocity.toFixed(2)} m/s` : "—"}</span>
        </div>
        <div className="flex-1 bg-gray-800 rounded-md p-1">
          <Line data={velocityChartData} options={commonOptions} />
        </div>
      </div>

      {/* RSSI Value + Chart */}
      <div className="flex flex-col flex-1 bg-gray-900 text-white rounded-md p-2">
        <div className="flex justify-between items-center mb-1">
          <span className="text-sm font-medium">RSSI:</span>
          <span>{Rssi != null ? `${Rssi.toFixed(2)} dBm` : "—"}</span>
        </div>
        <div className="flex-1 bg-gray-800 rounded-md p-1">
          <Line data={rssiChartData} options={commonOptions} />
        </div>
      </div>
    </aside>
  );
}
