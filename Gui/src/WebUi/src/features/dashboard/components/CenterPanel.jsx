// src/features/dashboard/components/CenterPanel.jsx
import React from "react";

export default function CenterPanel({ sendCommandToApi }) {
  // Five action buttons
  const commands = [
    { label: "Set Prelaunch", url: "http://localhost:5017/api/commands/2/send" },
    { label: "Set Launch Imininent", url: "http://localhost:5017/api/commands/3/send" },
    { label: "Set Coasting Descent", url: "http://localhost:5017/api/commands/4/send" },
    { label: "Set Main Deploy", url: "http://localhost:5017/api/commands/5/send" },
    { label: "Terminate", url: "http://localhost:5017/api/commands/1/send" },
  ];

  return (
    <section className="flex-1 bg-gray-50 dark:bg-gray-800 flex flex-col items-center justify-center p-4 overflow-auto">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {commands.map(({ label, url }) => (
          <button
            key={label}
            onClick={() => {
              const confirmed = window.confirm(`Are you sure you want to "${label}"?`);
              if (confirmed) {
                sendCommandToApi(url);
              }
            }}
            className="w-full px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
          >
            {label}
          </button>
        ))}
      </div>
    </section>
  );
}
