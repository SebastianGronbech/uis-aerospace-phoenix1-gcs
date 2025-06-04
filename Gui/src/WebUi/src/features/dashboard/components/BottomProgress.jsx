// src/features/dashboard/components/BottomProgress.jsx
import React from "react";

export default function BottomProgress({ activeStep = 1 }) {
  const steps = [
    { id: 1, label: "Pre Launch" },
    { id: 2, label: "Launch Imminent" },
    { id: 3, label: "Acceleration" },
    { id: 4, label: "Coasting Climb" },
    { id: 5, label: "Coasting Descent" },
    { id: 6, label: "Main" },
  ];

  return (
    <footer className="
      fixed bottom-0 left-0 right-0 
      bg-white dark:bg-gray-800 
      border-t border-gray-300 dark:border-gray-600 
      px-6 py-2 flex items-center 
      z-10
    ">
      <div className="flex flex-1">
        {steps.map((step) => (
          <div key={step.id} className="flex-1 flex flex-col items-center">
            <div
              className={`w-6 h-6 flex items-center justify-center rounded-full text-white text-sm ${
                step.id === activeStep
                  ? "bg-gray-800 dark:bg-gray-200 dark:text-gray-900"
                  : "bg-gray-400 dark:bg-gray-600"
              }`}
            >
              {step.id}
            </div>
            <span className="mt-1 text-xs text-gray-600 dark:text-gray-300 whitespace-nowrap">
              {step.label}
            </span>
          </div>
        ))}
      </div>
    </footer>
  );
}
