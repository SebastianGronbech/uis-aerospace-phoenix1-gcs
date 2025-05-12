import React from "react";

const UsageBar = ({ title, usagePercentage }) => {
    const percentage = Math.max(0, Math.min(100, usagePercentage || 0)); // Ensure percentage is between 0 and 100

    return (
        <div className="border dark:border-gray-700 rounded-2xl shadow p-4 bg-white dark:bg-gray-800 flex flex-col h-full">
            <p className="font-semibold text-gray-800 dark:text-white mb-2">
                {title}
            </p>
            <div className="w-full border dark:border-gray-600 relative mt-2 flex-grow min-h-[100px] rounded">
                <div
                    className="absolute bottom-0 w-full bg-blue-500 text-center text-white text-sm flex items-center justify-center rounded-b" // Added flex for centering text
                    style={{ height: `${percentage}%` }}
                >
                    {percentage}%
                </div>
            </div>
        </div>
    );
};

export default UsageBar;