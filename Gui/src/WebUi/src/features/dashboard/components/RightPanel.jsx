// src/features/dashboard/components/RightPanel.jsx
import React from "react";

export default function RightPanel({ connected, dashboardFields }) {
  const {
    Altitude = null,
    TotalVelocity = null,
    Status6 = null, // GPS Status
    Rssi = null,
    Max_Altitude = null,
    Max_Velocity = null,
    Status9 = null,
    Status10 = null, // Ignition
    Status11 = null, // Apogee Reached
    Status12 = null, // Burnout
    Status13 = null, // Main Deployed
    Status14 = null, // Simulation
    Status15 = null, // Drouge Deployed
    Status16 = null, // Drouge Pressure Drop
    Status17 = null, // Main Pressure Drop
    Drouge_pressure = null,
    Main_pressure = null,
    Voltage = null,
  } = dashboardFields || {};

  return (
    <aside className="flex-none w-1/4 bg-white dark:bg-gray-800
                      border-l border-gray-300 dark:border-gray-600
                      p-3 flex flex-col gap-4 overflow-y-auto">
      {/* Connection */}
      <div className="flex justify-between text-sm text-gray-800 dark:text-gray-200">
        <span className="font-medium">Connection:</span>
        <span className={connected ? "text-green-600" : "text-red-600"}>
          {connected ? "Connected" : "Disconnected"}
        </span>
      </div>

      {/* Altitude */}
      <div className="flex justify-between text-sm text-gray-800 dark:text-gray-200">
        <span className="font-medium">Altitude:</span>
        <span>{Altitude != null ? `${Altitude.toFixed(2)} m` : "-"}</span>
      </div>

      {/* Total Velocity */}
      <div className="flex justify-between text-sm text-gray-800 dark:text-gray-200">
        <span className="font-medium">Total Velocity:</span>
        <span>{TotalVelocity != null ? `${TotalVelocity.toFixed(2)} m/s` : "-"}</span>
      </div>

      {/* RSSI */}
      <div className="flex justify-between text-sm text-gray-800 dark:text-gray-200">
        <span className="font-medium">RSSI:</span>
        <span>{Rssi != null ? `${Rssi.toFixed(2)} dBm` : "-"}</span>
      </div>

    {/* GPS Status */}
<div className="flex justify-between items-center text-sm text-gray-800 dark:text-gray-200">
  <span className="font-medium">GPS Status:</span>
  <span className={`w-3 h-3 rounded-full ${
    Status6 ? "bg-green-500" : "bg-red-500"
  }`} />
</div>



      {/* Divider */}
      <div className="border-t border-gray-300 dark:border-gray-600 pt-2">
        {/* Max Altitude (FlightComputerValues) */}
        <div className="flex justify-between text-sm text-gray-800 dark:text-gray-200">
          <span className="font-medium">Max Altitude:</span>
          <span>{Max_Altitude != null ? `${Max_Altitude.toFixed(2)} m` : "-"}</span>
        </div>

        {/* Max Velocity (FlightComputerValues) */}
        <div className="flex justify-between text-sm text-gray-800 dark:text-gray-200">
          <span className="font-medium">Max Velocity:</span>
          <span>{Max_Velocity != null ? `${Max_Velocity.toFixed(2)} m/s` : "-"}</span>
        </div>
         {/* Drogue_pressure (FlightComputerValues) */}
        <div className="flex justify-between text-sm text-gray-800 dark:text-gray-200">
          <span className="font-medium">Drogue Pressure:</span>
          <span>{Drouge_pressure != null ? `${Drouge_pressure.toFixed(2)} bar` : "-"}</span>
        </div>
        {/* Main_pressure (FlightComputerValues) */}
        <div className="flex justify-between text-sm text-gray-800 dark:text-gray-200">
          <span className="font-medium">Main Pressure:</span>
          <span>{Main_pressure != null ? `${Main_pressure.toFixed(2)} bar` : "-"}</span>
        </div>
        {/* Voltage (FlightComputerValues) */}
        <div className="flex justify-between text-sm text-gray-800 dark:text-gray-200">
          <span className="font-medium">Voltage:</span>
          <span>{Voltage != null ? `${Voltage.toFixed(2)} V` : "-"}</span>
        </div>
      </div>
      {/* Ignition */}
       <div className="flex justify-between items-center text-sm text-gray-800 dark:text-gray-200">
        <span className="font-medium">Ignition</span>
        <span className={`w-3 h-3 rounded-full ${
         Status10 ? "bg-green-500" : "bg-red-500"
         }`} />
      </div>
      {/* Apogee Reached */}
       <div className="flex justify-between items-center text-sm text-gray-800 dark:text-gray-200">
        <span className="font-medium">Apogee Reached:</span>
        <span className={`w-3 h-3 rounded-full ${
         Status11 ? "bg-green-500" : "bg-red-500"
         }`} />
      </div>
      {/* Burnout */}
       <div className="flex justify-between items-center text-sm text-gray-800 dark:text-gray-200">
        <span className="font-medium">Burnout:</span>
        <span className={`w-3 h-3 rounded-full ${
         Status12 ? "bg-green-500" : "bg-red-500"
         }`} />
      </div>
      {/* Main Deployed */}
       <div className="flex justify-between items-center text-sm text-gray-800 dark:text-gray-200">
        <span className="font-medium">Main Deployed:</span>
        <span className={`w-3 h-3 rounded-full ${
         Status13 ? "bg-green-500" : "bg-red-500"
         }`} />
      </div>
      {/* Main Pressure Drop */}
       <div className="flex justify-between items-center text-sm text-gray-800 dark:text-gray-200">
        <span className="font-medium">Main Pressure Drop:</span>
        <span className={`w-3 h-3 rounded-full ${
         Status17 ? "bg-green-500" : "bg-red-500"
         }`} />
      </div>
      {/* Drouge Deployed */}
       <div className="flex justify-between items-center text-sm text-gray-800 dark:text-gray-200">
        <span className="font-medium">Drouge Deployed:</span>
        <span className={`w-3 h-3 rounded-full ${
         Status15 ? "bg-green-500" : "bg-red-500"
         }`} />
      </div>
      {/* Drouge Pressure Drop */}
       <div className="flex justify-between items-center text-sm text-gray-800 dark:text-gray-200">
        <span className="font-medium">Drouge Pressure Drop:</span>
        <span className={`w-3 h-3 rounded-full ${
         Status16 ? "bg-green-500" : "bg-red-500"
         }`} />
      </div>
      {/* Simulation */}
       <div className="flex justify-between items-center text-sm text-gray-800 dark:text-gray-200">
        <span className="font-medium">Simulation:</span>
        <span className={`w-3 h-3 rounded-full ${
         Status14 ? "bg-green-500" : "bg-red-500"
         }`} />
      </div>
      

      
    </aside>
  );
}
