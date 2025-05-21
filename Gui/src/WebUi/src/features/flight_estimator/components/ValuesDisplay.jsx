import React from "react";

const ValuesDisplay = ({ labels, values }) => {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 text-sm">
      {labels.map((label, i) => (
        <div key={i} className="p-2 bg-gray-800 rounded text-center">
          <div className="text-xs text-gray-400">{label}</div>
          <div className="text-lg font-mono">
            {typeof values[label] === "number"
              ? values[label].toFixed(2)
              : values[label] ?? "-"}
          </div>
        </div>
      ))}
    </div>
  );
};

export default ValuesDisplay;
