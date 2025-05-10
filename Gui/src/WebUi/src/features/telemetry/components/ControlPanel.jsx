import React from "react";

const controlPanel = ({ moduleName, onReset }) => {
    return (
        <div className="space-y-2">
            <button
                onClick={onReset}
                className="w-full bg-gray-200 dark:bg-gray-700 rounded py-2 font-semibold text-gray-800 dark:text-white hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors"
            >
                Reset {moduleName}
            </button>
        </div>
    );
};

export default controlPanel;
