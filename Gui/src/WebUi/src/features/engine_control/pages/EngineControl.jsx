import React from 'react';
import {
  Chart as ChartJS,
  LineElement,
  CategoryScale,
  LinearScale,
  PointElement,
  Tooltip,
  Legend,
} from 'chart.js';
import { Line } from 'react-chartjs-2';

ChartJS.register(LineElement, CategoryScale, LinearScale, PointElement, Tooltip, Legend);

const labels = Array.from({ length: 60 }, (_, i) => i + 1);

const createChartData = (label, color) => ({
  labels,
  datasets: [
    {
      label,
      data: labels.map((x) => Math.sin(x / 10) * 20 + 40),
      borderColor: color,
      tension: 0.3,
      pointRadius: 2,
    },
  ],
});

const chartOptions = {
  responsive: true,
  maintainAspectRatio: false,
  layout: { padding: 0 },
  plugins: {
    legend: {
      labels: { color: '#fff' },
    },
  },
  scales: {
    x: {
      min: 1,
      max: 60,
      ticks: {
        color: '#fff',
        autoSkip: false,
        stepSize: 1,
        maxTicksLimit: 60,
      },
      title: { display: true, text: 'Time (s)', color: '#fff' },
    },
    y: {
      beginAtZero: true,
      ticks: { color: '#fff' },
    },
  },
};

const telemetryFields = [
  'CC', 'OxIn', 'FuelIn',
  'Temp Walls', 'Temp Nozzle',
  'P N2O', 'P ETH',
  'Q N2O', 'Q ETH',
  'M1 Pos', 'M1 Temp', 'M1 Curr',
  'M2 Pos', 'M2 Temp', 'M2 Curr',
];

const EngineControl = () => {
    const handleCommand = (cmd) => {
        const confirmMessage = `Are you sure you want to send the "${cmd}" command?`;
        const confirmed = window.confirm(confirmMessage);
      
        if (confirmed) {
          alert(`✅ "${cmd}" command sent!`);
          // TODO: Send command to backend here
        }
      };
      

  return (
    <div className="h-screen overflow-hidden flex flex-col bg-gray-900 text-white p-4 space-y-4">

      <h1 className="text-xl font-semibold">Engine Control Panel</h1>

      {/* Main content layout */}
      <div className="flex flex-1 overflow-hidden gap-4">
        {/* Graphs */}
        <div className="flex-1 space-y-3 overflow-hidden">
          <div className="h-32 bg-black p-2 rounded shadow">
            <h2 className="text-sm mb-1">PRESSURES BERSERKR (bar)</h2>
            <Line data={createChartData('Sample Data', '#f87171')} options={chartOptions} />
          </div>

          <div className="h-32 bg-black p-2 rounded shadow">
            <h2 className="text-sm mb-1">PRESSURES TANK (bar)</h2>
            <Line data={createChartData('Sample Data', '#f87171')} options={chartOptions} />
          </div>

          <div className="h-32 bg-black p-2 rounded shadow">
            <h2 className="text-sm mb-1">FLOW (g/s)</h2>
            <Line data={createChartData('Sample Data', '#f87171')} options={chartOptions} />
          </div>

          <div className="h-32 bg-black p-2 rounded shadow">
            <h2 className="text-sm mb-1">VALVE POSITION (rad)</h2>
            <Line
              data={{
                labels,
                datasets: [
                  {
                    label: 'ETH (M1)',
                    data: labels.map((x) => Math.sin(x / 8) * 0.5 + 0.2),
                    borderColor: '#facc15',
                    tension: 0.3,
                    pointRadius: 1,
                  },
                  {
                    label: 'N2O (M2)',
                    data: labels.map((x) => Math.cos(x / 8) * 0.4),
                    borderColor: '#3b82f6',
                    tension: 0.3,
                    pointRadius: 1,
                  },
                ],
              }}
              options={chartOptions}
            />
          </div>
        </div>

        {/* Telemetry panel - no scroll */}
        <div className="w-1/4 bg-gray-800 p-4 rounded shadow space-y-2">
          {telemetryFields.map((label, i) => (
            <div key={i} className="flex justify-between border-b border-gray-600 pb-1">
              <span>{label}:</span>
              <span>--</span>
            </div>
          ))}
        </div>
      </div>

      {/* Status and Controls */}
      <div className="space-y-1 text-sm">

        <div className="text-red-500 font-bold">NO COM</div>

        <div className="flex flex-wrap gap-2">
          {['CAL MOTORS', 'IDLE', 'HOME', 'RELIEF', 'FIRE', 'ABORT FIRE', 'PARAMETERS'].map((label) => (
            <button
              key={label}
              onClick={() => handleCommand(label)}
              className="px-4 py-2 bg-slate-700 rounded hover:bg-slate-600"
            >
              {label}
            </button>
          ))}
        </div>

        <div className="bg-green-600 text-center text-white py-1 rounded text-sm">

          Stop Logging
        </div>
        <div className="text-xs text-gray-300">

          Started logging to data_20250423_132906.csv
        </div>
      </div>
    </div>
  );
};

export default EngineControl;
