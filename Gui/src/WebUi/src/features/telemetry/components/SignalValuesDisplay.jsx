import React from "react";

const SignalValuesDisplay = ({ data }) => {
    if (!data) return null;

    return (
        <div className="bg-gray-800 text-white p-4 rounded shadow">
            <h3 className="text-lg font-semibold mb-2">Telemetry Data</h3>
            <ul className="space-y-1">
                {Object.entries(data).map(([key, value]) => (
                    <li key={key} className="flex justify-between">
                        <span className="font-medium">{key}</span>
                        <span>{String(value)}</span>
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default SignalValuesDisplay;
