import React from "react";

const StatusDisplay = ({ title, statuses }) => {
    // statuses is an array of objects like [{ label: "Navn (Ground)", isOn: true }]
    return (
        <div className="border dark:border-gray-700 rounded-2xl shadow p-4">
            <p className="font-semibold text-gray-800 dark:text-white mb-2">
                {title}
            </p>
            <div className="flex flex-col space-y-1 pl-2">
                {statuses && statuses.length > 0 ? (
                    statuses.map((status, index) => (
                        <div
                            key={index}
                            className="flex items-center space-x-2 text-sm text-gray-700 dark:text-gray-300"
                        >
                            <span
                                className={`w-3 h-3 rounded-full ${
                                    status.isOn ? "bg-green-500" : "bg-red-500"
                                }`}
                            ></span>
                            <span>{status.label}</span>
                        </div>
                    ))
                ) : (
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                        No status available.
                    </p>
                )}
            </div>
        </div>
    );
};

export default StatusDisplay;
