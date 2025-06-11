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
  const { N2OTank, ETHTank, M1Pos, M2Pos, Pressure, N2OInjector, ETHInjector } = telemetryFields || {};

  const labels = telemetryHistory.map((p) => p.timestamp);
  const TankData = telemetryHistory.map((p) => p.N2OTank);
  const ETHTankData = telemetryHistory.map((p) => p.ETHTank);
  const M1PosData = telemetryHistory.map((p) => p.M1Pos);
  const M2PosData = telemetryHistory.map((p) => p.M2Pos);
  const PressureData = telemetryHistory.map((p) => p.Pressure);
  const N2OInjectorData = telemetryHistory.map((p) => p.N2OInjector);
  const ETHInjectorData = telemetryHistory.map((p) => p.ETHInjector);
  
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
      legend: { display: true },
      tooltip: {
        backgroundColor: "#333",
        titleColor: "#fff",
        bodyColor: "#fff",
      },
    },
  };

  const TankChartData = {
  labels,
  datasets: [
    {
      label: "N2O Tank",
      data: TankData,
      borderColor: "blue", // Blue for N2O
      borderWidth: 2,
      pointRadius: 0,
      tension: 0.2,
    },
    {
      label: "ETH Tank",
      data: ETHTankData,
      borderColor: "red", // Red for ETH
      borderWidth: 2,
      pointRadius: 0,
      tension: 0.2,
    },
  ],
};


  const ValveChartData = {
  labels,
  datasets: [
    {
      label: "M1",
      data: M1PosData,
      borderColor: "red", // Blue for N2O
      borderWidth: 2,
      pointRadius: 0,
      tension: 0.2,
    },
    {
      label: "M2",
      data: M2PosData,
      borderColor: "blue", // Red for ETH
      borderWidth: 2,
      pointRadius: 0,
      tension: 0.2,
    },
  ],
};

const BerserkerChartData = {
  labels,
  datasets: [
    {
      label: "CC Pressures",
      data: PressureData,
      borderColor: "orange",
      borderWidth: 2,
      pointRadius: 0,
      tension: 0.2,
    },
    {
      label: "N20In",
      data: N2OInjectorData,
      borderColor: "blue",
      borderWidth: 2,
      pointRadius: 0,
      tension: 0.2,
    },
    {
      label: "ETHIn",
      data: ETHInjectorData,
      borderColor: "red",
      borderWidth: 2,
      pointRadius: 0,
      tension: 0.2,
    },
  ],
};

  return (
    <aside className="flex-none w-3/4 bg-white dark:bg-gray-800 border-r border-gray-300 dark:border-gray-600 p-3 flex flex-col gap-4 overflow-hidden">
      {/* Pressures Berserkr Chart */}
      <div className="flex flex-col flex-1 bg-gray-900 text-white rounded-md p-2"> 
        <div className="flex-1 bg-gray-800 rounded-md p-1">
          <Line data={BerserkerChartData} options={commonOptions} />
        </div>
      </div>

      {/* Pressures Tank */}
      <div className="flex flex-col flex-1 bg-gray-900 text-white rounded-md p-2">
        <div className="flex-1 bg-gray-800 rounded-md p-1">
          <Line data={TankChartData} options={commonOptions} />
        </div>
      </div>

      {/* Valve Pos */}
      <div className="flex flex-col flex-1 bg-gray-900 text-white rounded-md p-2">
        <div className="flex-1 bg-gray-800 rounded-md p-1">
          <Line data={ValveChartData} options={commonOptions} />
        </div>
      </div>
    </aside>
  );
}
