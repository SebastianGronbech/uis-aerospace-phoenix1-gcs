import React from "react";

const baseUrl = import.meta.env.VITE_API_URL;

export default function BottomPanel({ sendCommandToApi, EngineFields }) {
  const statusKeys = [
    "CalMotors",
    "IDLE",
    "Homing",
    "Fire",
    "Abort",
    "Relief",
    "Fueling",
    "ExitMotors"
  ];

  const currentStatus = statusKeys.find((key) => EngineFields?.[key] === 1);

  const commands = [
    { label: "IDLE", url: `${baseUrl}/api/commands/100/send` },
    { label: "RELIEF OPEN", url: `${baseUrl}/api/commands/101/send` },
    { label: "RELIEF CLOSE", url: `${baseUrl}/api/commands/102/send` },
    { label: "RELIEF N2O", url: `${baseUrl}/api/commands/103/send` },
    { label: "RELIEF ETH", url: `${baseUrl}/api/commands/104/send` },
    { label: "FILL OPEN", url: `${baseUrl}/api/commands/105/send` },
    { label: "FILL CLOSE", url: `${baseUrl}/api/commands/106/send` },
    { label: "FIRE", url: `${baseUrl}/api/commands/107/send` },
    { label: "ABORT", url: `${baseUrl}/api/commands/108/send` },
  ];

  // Optional: Format status text
  const formatStatus = (s) => s ? s.charAt(0) + s.slice(1).toLowerCase() : "Unknown";

  return (
    <section className="w-full bg-white dark:bg-gray-800 border-t border-gray-300 dark:border-gray-600 p-4">
      {/* ✅ Engine Status Display */}
      <div className="mb-4 text-lg font-semibold text-center">
        Status:{" "}
        <span className="text-blue-600">
          {formatStatus(currentStatus)}
        </span>
      </div>

      {/* 🔘 Command Buttons */}
      <div className="flex flex-wrap gap-4 justify-start">
        {commands.map(({ label, url }) => (
          <button
            key={label}
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
    </section>
  );
}
