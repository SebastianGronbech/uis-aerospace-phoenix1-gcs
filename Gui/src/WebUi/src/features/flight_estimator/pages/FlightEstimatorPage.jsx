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
  "Altitude",
  "TotalVelocity",
  "Climbrate",
  "Latitude",
  "Longitude",
  "Roll",
  "Pitch",
  "Yaw",
  "Date",
];

const FlightEstimatorPage = () => {
  const {
    estimatorFields,
    getChartData,
    connected,
  } = useFlightEstimatorHub();

const statusMap = {
    Status0: "Calibrating Altitude",
    Status1: "Calibrating Kalman",
    Status2: "Awaiting GNSS",
    Status3: "Recording",
    Status4: "Erasing Recordings",
    Status5: "Acceleration Predictor",
    Status6: "GNSS Status",
    Status7: "Calibrated and Running",
  };  

 const logEstimatorStatuses = (estimatorFields) => {
  
  console.log("📡 Estimator Statuses:");
  Object.entries(statusMap).forEach(([signalKey, label]) => {
    const value = estimatorFields[signalKey];
    console.log(`- ${label}: ${value ?? "Not received"}`);
  });
};



;

  const statusItems = [
  { label: "Connected", isOn: connected },
  ...Object.entries(statusMap).map(([signalKey, label]) => {
    const value = estimatorFields[signalKey];
    return {
      label: `${label} (${value ?? "-"})`,
      isOn: value === 1,
    };
  }),
];




  const sendCommandToApi = async (url) => {
    try {
      const response = await fetch(url, {
        method: "POST",
      });
      if (!response.ok) {
        console.error("Failed to send command:", response.statusText);
      } else {
        console.log("Command sent to", url);
      }
    } catch (err) {
      console.error("Error sending command to", url, ":", err);
    }
  };

  return (
    <div className="p-4 text-sm bg-gray-900 text-white min-h-screen h-screen flex flex-col gap-4">
      <h1 className="text-xl font-semibold">Flight Estimator</h1>

      <StatusDisplay statuses={statusItems} />

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
        {[
          { label: "Calibrate Kalman", url: "http://localhost:5017/api/commands/21/send" },
          { label: "Calibrate Altitude", url: "http://localhost:5017/api/commands/20/send" },
          { label: "Start Recording", url: "http://localhost:5017/api/commands/22/send" },
          { label: "Stop Recording", url: "http://localhost:5017/api/commands/23/send" },
          { label: "Erase Recording", url: "http://localhost:5017/api/commands/24/send" },
          { label: "Start Acc predictor", url: "http://localhost:5017/api/commands/25/send" },
          { label: "Stop Acc predictor", url: "http://localhost:5017/api/commands/26/send" },
        ].map(({ label, url }) => (
          <button
            key={url}
            onClick={() => {
              const confirmed = window.confirm(`Are you sure you want to "${label}"?`);
              if (confirmed) {
                sendCommandToApi(url);
              }
            }}
            className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
          >
            {label}
          </button>
        ))}
      </div>
    </div>
  );
};

export default FlightEstimatorPage;
