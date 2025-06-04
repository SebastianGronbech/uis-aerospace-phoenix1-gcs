// src/features/dashboard/pages/DashboardPage.jsx
import React from "react";
import { useDashboardData } from "../hooks/useDashboardData";
import LeftPanel from "../components/LeftPanel";
import CenterPanel from "../components/CenterPanel";
import RightPanel from "../components/RightPanel";
import BottomProgress from "../components/BottomProgress";

export default function DashboardPage() {
  const { connected, dashboardFields, telemetryHistory } = useDashboardData();

  const sendCommandToApi = async (url) => {
    try {
      const response = await fetch(url, { method: "POST" });
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
    <div className="flex flex-col h-screen bg-gray-100 dark:bg-gray-900">
      {/* Panels container: add bottom padding so content isn’t hidden behind the fixed bar */}
      <div className="flex flex-1 overflow-hidden pb-12">
        <LeftPanel
          telemetryFields={dashboardFields}
          telemetryHistory={telemetryHistory}
        />

        <CenterPanel sendCommandToApi={sendCommandToApi} />

        <RightPanel connected={connected} dashboardFields={dashboardFields} />
      </div>

      <BottomProgress />
    </div>
  );
}

