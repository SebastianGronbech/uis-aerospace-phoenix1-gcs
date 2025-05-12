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

ChartJS.register(
  LineElement,
  CategoryScale,
  LinearScale,
  PointElement,
  Tooltip,
  Legend
);

const labels = Array.from({ length: 60 }, (_, i) => i + 1);

const chartOptions = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: {
      display: true,
      labels: { color: '#ffffff' },
    },
  },
  layout: {
    padding: 0,
  },
  scales: {
    x: {
      title: { display: true, text: 'Time (s)', color: '#ffffff' },
      ticks: {
        color: '#ffffff',
        autoSkip: true, // ✅ allow it to skip some ticks
        maxTicksLimit: 20, // ✅ show fewer ticks
        callback: function(value) {
          return value % 5 === 0 ? value : ''; // ✅ show only every 5th label
        },
      },
      
      min: 1,
      max: 60,
      grid: { drawOnChartArea: true },
    },
    y: {
      beginAtZero: true,
      ticks: { color: '#ffffff' },
    },
  },
};

const sampleData = {
  labels,
  datasets: [
    {
      label: 'Sample Data',
      data: Array.from({ length: 60 }, (_, i) => Math.round(Math.sin(i / 6) * 20 + 25)),
      borderColor: 'rgb(255, 99, 132)',
      tension: 0.1,
    },
  ],
};

const FlightEstimatorPage = () => {
  const fieldLabels = [
    'Field 1', 'Field 2', 'Field 3', 'Field 4', 'Field 5', 'Field 6',
    'Field 7', 'Field 8', 'Field 9', 'Field 10', 'Field 11', 'Field 12',
  ];

 const handleCommand = (cmd) => {
    const confirmed = window.confirm(`Are you sure you want to send the "${cmd}" command?`);
    if (confirmed) {
      alert(`✅ "${cmd}" command sent!`);
      // send to backend here later
    }
  };
  

  return (
    <div className="p-4 text-sm bg-gray-900 text-white min-h-screen h-screen grid grid-rows-[auto_auto_1fr_auto] gap-4">
      <h1 className="text-xl font-semibold">Flight Estimator</h1>

      <div className="grid grid-cols-3 gap-4">
        {fieldLabels.map((label, idx) => (
          <div key={idx} className="space-y-1 bg-gray-800 p-2 rounded">
            <label className="block text-white font-medium">{label}</label>
            <div className="p-2 bg-gray-900 border border-gray-600 rounded text-center">
              --
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-2 gap-4">
        {[1, 2].map((_, idx) => (
          <div key={idx} className="h-40 bg-black border rounded shadow p-2">
            <h2 className="text-white mb-1 text-sm">Graph {idx + 1}</h2>
            <div className="w-full h-full">
              <Line data={sampleData} options={chartOptions} />
            </div>
          </div>
        ))}
      </div>

      <div className="flex flex-wrap gap-2">
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
