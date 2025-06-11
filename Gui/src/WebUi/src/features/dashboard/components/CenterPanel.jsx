// src/features/dashboard/components/CenterPanel.jsx
import React from "react";
import MapWithTrajectory from "./MapWithTrajectory";
const baseUrl = import.meta.env.VITE_API_URL;
export default function CenterPanel({ sendCommandToApi }) {
  // Five action buttons
  const commands = [
    { label: "Set Prelaunch", url: `${baseUrl}/api/commands/2/send` },
    { label: "Set Launch Imininent", url:`${baseUrl}/api/commands/3/send` },
    { label: "Set Coasting Descent", url: `${baseUrl}/api/commands/4/send` },
    { label: "Set Main Deploy", url: `${baseUrl}/api/commands/5/send` },
    { label: "Terminate", url: `${baseUrl}/api/commands/1/send` },
    { label: "Simulate", url: `${baseUrl}/api/commands/6/send` },
  ];

  // Example trajectory points
  const trajectoryPoints = [
    { lat: 40.730610, lng: -74.0060 },
    { lat: 40.721, lng: -73.990 },
    { lat: 40.715, lng: -73.950 },
  ];

  return (
   <section className="flex-1 bg-gray-50 dark:bg-gray-400 flex flex-col items-center justify-start p-4 overflow-auto space-y-2">
      <MapWithTrajectory points={trajectoryPoints} />
      <div className="flex flex-row gap-4 pb-2">
        {commands.map(({ label, url }) => (
          <button
            key={label}
            onClick={() => {
              const confirmed = window.confirm(`Are you sure you want to "${label}"?`);
              if (confirmed) {
                sendCommandToApi(url);
              }
            }}
            className="w-full px-4 py-2 bg-red-600 text-white inline-block rounded hover:bg-red-700"
          >
            {label}
          </button>
        ))}
      </div>
    </section>
  );
}
