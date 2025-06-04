// src/features/dashboard/components/RightPanel.jsx
import React from "react";

export default function RightPanel({ connected, dashboardFields }) {
  const {
    Altitude = null,
    TotalVelocity = null,
    GPSFix = null,
    Rssi = null,
  } = dashboardFields || {};

  return (
    <aside className="flex-none w-1/4 bg-white dark:bg-gray-800 border-l border-gray-300 dark:border-gray-600 p-3 flex flex-col gap-4 overflow-y-auto">
      {/* Connection Status */}
      <div className="flex justify-between text-sm text-gray-800 dark:text-gray-200">
        <span className="font-medium">Connection:</span>
        <span className={connected ? "text-green-600" : "text-red-600"}>
          {connected ? "Connected" : "Disconnected"}
        </span>
      </div>

      {/* Altitude Value */}
      <div className="flex justify-between text-sm text-gray-800 dark:text-gray-200">
        <span className="font-medium">Altitude:</span>
        <span>{Altitude != null ? `${Altitude.toFixed(2)} m` : "-"}</span>
      </div>

      {/* Total Velocity Value */}
      <div className="flex justify-between text-sm text-gray-800 dark:text-gray-200">
        <span className="font-medium">Total Velocity:</span>
        <span>
          {TotalVelocity != null ? `${TotalVelocity.toFixed(2)} m/s` : "-"}
        </span>
      </div>

      {/* RSSI Value */}
      <div className="flex justify-between text-sm text-gray-800 dark:text-gray-200">
        <span className="font-medium">RSSI:</span>
        <span>{Rssi != null ? `${Rssi.toFixed(2)} dBm` : "-"}</span>
      </div>

      {/* GPS Status */}
      <div className="flex justify-between items-center text-sm text-gray-800 dark:text-gray-200">
        <span className="font-medium">GPS Status:</span>
        <span
          className={`w-3 h-3 rounded-full ${
            GPSFix ? "bg-green-500" : "bg-red-500"
          }`}
        />
      </div>
    </aside>
  );
}
