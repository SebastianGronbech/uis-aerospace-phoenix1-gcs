import React from "react";
// import PacketStats from "./PacketStats"; // Assuming you create/have this
import ControlPanel from "./ControlPanel";
import StatusDisplay from "./StatusDisplay"; // Corrected filename if it was a typo

const ModuleCard = ({
    moduleTitle,
    packetStatsData, // e.g., { received: 502, sent: 605, otherStats: [...] }
    onReset,
    statusItems,
}) => {
    return (
        <div className="space-y-4 p-4 border dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 shadow">
            <h3 className="text-xl font-semibold text-gray-800 dark:text-white mb-3">
                {moduleTitle}
            </h3>


            <div className="border dark:border-gray-700 rounded-2xl shadow p-4">
    <p className="font-semibold">
        Packets Recieved / Sent ({moduleTitle.split(" ")[0]})
    </p>
    
    <p> - {packetStatsData?.downlink ?? "N/A"}</p>
    <p> - {packetStatsData?.uplink ?? "N/A"}</p>
</div>


            <ControlPanel
                moduleName={moduleTitle.split(" ")[0]} // Extracts "Ground" or "Rocket"
                onReset={onReset}
            />

            {/* Controls for Ground Module */}
            {/* <div className="space-y-2">
                            <button className="w-full bg-gray-200 dark:bg-gray-700 rounded py-2 font-semibold text-gray-800 dark:text-white hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors">
                                Reset Ground
                            </button>
                            <button className="w-full bg-gray-200 dark:bg-gray-700 rounded py-2 font-semibold text-gray-800 dark:text-white hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors">
                                Init Ground
                            </button>
                        </div> */}

            <StatusDisplay
                title={`Status (${moduleTitle.split(" ")[0]})`}
                statuses={statusItems}
            />
        </div>
    );
};

export default ModuleCard;
