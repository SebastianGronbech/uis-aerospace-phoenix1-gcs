// src/features/dashboard/components/ChartPlaceholder.jsx
import React from "react";

export default function ChartPlaceholder({ title, unit }) {
  return (
    <div className="border border-gray-300 dark:border-gray-600 rounded-md p-2 flex flex-col h-60 bg-white dark:bg-gray-800">
      <div className="flex justify-between items-center mb-1">
        <span className="text-sm font-medium text-gray-700 dark:text-gray-300">{title}</span>
        <span className="text-xs italic text-gray-500 dark:text-gray-400">{unit}</span>
      </div>
      <div className="flex-1 border-2 border-dashed border-gray-200 dark:border-gray-700 rounded-md flex items-center justify-center text-gray-400 dark:text-gray-500 text-sm">
        [Chart]
      </div>
    </div>
  );
}
