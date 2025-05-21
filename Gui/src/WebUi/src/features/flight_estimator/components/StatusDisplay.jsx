import React from "react";

const StatusDisplay = ({ statuses }) => {
  return (
    <div className="flex flex-row justify-center gap-6 mb-2">
      {statuses.map(({ label, isOn }, idx) => (
        <div key={idx} className="flex items-center gap-2 text-sm">
          <span
            className={`w-4 h-4 rounded-full border-2 border-gray-700 ${
              isOn ? "bg-green-500" : "bg-red-500"
            }`}
          />
          <span className="text-white">{label}</span>
        </div>
      ))}
    </div>
  );
};
export default StatusDisplay;
