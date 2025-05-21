import React from "react";
import ChartCard from "../components/ChartCard";
import StatusDisplay from "../components/StatusDisplay";
import ValuesDisplay from "../components/ValuesDisplay";
import { useFlightEstimatorHub } from "../hooks/useFlightEstimatorHub";

import {
  Chart as ChartJS,
  LineElement,
  CategoryScale,
  LinearScale,
  PointElement,
  Tooltip,
  Legend,
} from "chart.js";

ChartJS.register(LineElement, CategoryScale, LinearScale, PointElement, Tooltip, Legend);

const chartOptions = {
  responsive: true,
  maintainAspectRatio: false,
  animation: false,
  plugins: {
    decimation: {
      enabled: true,
      algorithm: "lttb",
      samples: 100,
      threshold: 200,
    },
    legend: {
      display: true,
      labels: { color: "#ffffff" },
    },
  },
  scales: {
    x: {
      ticks: {
        color: "#ffffff",
        autoSkip: true,
        maxTicksLimit: 10,
      },
      grid: {
        color: "rgba(255,255,255,0.1)",
      },
    },
    y: {
      beginAtZero: true,
      ticks: { color: "#ffffff" },
      grid: {
        color: "rgba(255,255,255,0.1)",
      },
      min: 0,
    },
  },
  layout: {
    padding: { right: 0 },
  },
};

const fieldLabels = [
  "Altitude",         // meters
  "TotalVelocity",    // m/s
  "Climbrate",        // m/s
  "Latitude",
  "Longitude",
  "Roll",
  "Pitch",
  "Yaw",
  "Time",
  "Date",
];

const FlightEstimatorPage = () => {
  const {
    estimatorFields,
    getChartData,
    sendCommand,
    connected,
  } = useFlightEstimatorHub();

  // Build statusItems for Connected and 5 CAN statuses
  const statusKeys = ["Status0", "Status1", "Status2", "Status3", "Status4"];
  //console.log("Status0 value:", estimatorFields["Status0"]);
  //console.log("Estimator fields:", estimatorFields);

  const statusItems = [
    { label: "Connected", isOn: connected },
    ...statusKeys.map((key) => {
      const value = estimatorFields[key];
      // Try to interpret value as ASCII char if it's a number
      const asChar = typeof value === "number" ? String.fromCharCode(value) : value;
      //console.log(`Key: ${key}, Raw:`, value, "asChar:", asChar, "isOn:", asChar === "A");
      return {
        label: `${key} (${asChar ?? "-"})`,
        isOn: asChar === "A",
      };
    })
  ];

  const handleCommand = (cmd) => {
    const confirmed = window.confirm(`Are you sure you want to send the "${cmd}" command?`);
    if (confirmed) {
      sendCommand(cmd);
    }
  };

  return (
    <div className="p-4 text-sm bg-gray-900 text-white min-h-screen h-screen flex flex-col gap-4">
      <h1 className="text-xl font-semibold">Flight Estimator</h1>

      {/* Status lights for Connected and the 5 CAN status bytes */}
      <StatusDisplay statuses={statusItems} />

      {/* Display all current telemetry values */}
      <ValuesDisplay labels={fieldLabels} values={estimatorFields} />

      <div className="grid grid-cols-2 gap-4 h-[50vh]">
        <ChartCard
          title="Altitude"
          fieldKey="Altitude"
          getChartData={getChartData}
          chartOptions={chartOptions}
        />
        <ChartCard
          title="Climbrate"
          fieldKey="Climbrate"
          getChartData={getChartData}
          chartOptions={chartOptions}
        />
      </div>

      <div className="flex flex-wrap gap-2 mt-auto">
        {[...Array(6)].map((_, i) => (
          <button
            key={i}
            onClick={() => handleCommand(i)}
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
          >
            {`Button ${i + 1}`}
          </button>
        ))}
      </div>
    </div>
  );
};

export default FlightEstimatorPage;
