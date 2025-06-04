// src/features/dashboard/pages/DashboardPage.jsx
import React from "react";
import { useDashboardData } from "../hooks/useDashboardData";
import LeftPanel from "../components/LeftPanel";
import CenterPanel from "../components/CenterPanel";
import RightPanel from "../components/RightPanel";
import BottomProgress from "../components/BottomProgress";

export default function DashboardPage() {
  const { connected, dashboardFields, telemetryHistory } = useDashboardData();
  const { Status9 = null } = dashboardFields || {};

  // Map Status9 codes → BottomProgress step (1–7)
  const statusCodeToStep = {
    0xAAAAAAAA: 1, // PRE_LAUNCH
    0xAAAABBBB: 2, // LAUNCH_IMMINENT
    0xAAAACCCC: 3, // ACCELERATION
    0xAAAADDDD: 4, // COASTING_CLIMB
    0xAAAAEEEE: 5, // COASTING_DESCENT
    0xAAAAFFFF: 6, // MAIN_DEPLOY
    0xCCCCAAAA: 7, // TERMINATE
  };
  const activeStep = statusCodeToStep[Status9] ?? null;

  // If you need command buttons in CenterPanel, pass a function
  const sendCommandToApi = async (url) => {
    try {
      const response = await fetch(url, { method: "POST" });
      if (!response.ok) {
        console.error("Failed to send command:", response.statusText);
      }
    } catch (err) {
      console.error("Error sending command to", url, ":", err);
    }
  };

  return (
    <div className="flex flex-col h-screen bg-gray-100 dark:bg-gray-900">
      {/* Panels container: pb-12 ensures nothing is hidden behind the fixed BottomProgress */}
      <div className="flex flex-1 overflow-hidden pb-12">
        <LeftPanel
          telemetryFields={{
            Altitude: dashboardFields.Altitude,
            TotalVelocity: dashboardFields.TotalVelocity,
            Rssi: dashboardFields.Rssi,
          }}
          telemetryHistory={telemetryHistory}
        />

        <CenterPanel sendCommandToApi={sendCommandToApi} />

        <RightPanel
          connected={connected}
          dashboardFields={dashboardFields}
        />
      </div>

      <BottomProgress activeStep={activeStep} />
    </div>
  );
}
