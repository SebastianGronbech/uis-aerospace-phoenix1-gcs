// src/features/dashboard/pages/DashboardPage.jsx

import { useEngineData } from "../hooks/useEngineData";
import LeftPanel from "../components/LeftPanel";
import RightPanel from "../components/RightPanel";
import BottomPanel from "../components/BottomPanel";

export default function EnginePage() {
  const { connected, EngineFields, telemetryHistory } = useEngineData();
  


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
            N2OTank: EngineFields.N2OTank,
            ETHTank: EngineFields.ETHTank,
            M1Pos: EngineFields.M1Pos,
            M2Pos: EngineFields.M2Pos,
            Pressure: EngineFields.Pressure,
            N2OInjector: EngineFields.N2OInjector,
            ETHInjector: EngineFields.ETHInjector,
          }}
          telemetryHistory={telemetryHistory}
        />
        
        <RightPanel
          connected={connected}
          EngineFields={EngineFields}
        />
      </div>

   <BottomPanel sendCommandToApi={sendCommandToApi} /> 
    </div>
  );
}
