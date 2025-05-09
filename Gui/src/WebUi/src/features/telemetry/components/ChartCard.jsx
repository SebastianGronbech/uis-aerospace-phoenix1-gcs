import React from "react";
import { Line } from "react-chartjs-2";

export default function ChartCard({
    title,
    chartData,
    chartOptions,
    cardHeight = "h-64",
    chartHeight = "h-56",
}) {
    return (
        <div
            className={`border dark:border-gray-700 rounded-2xl shadow p-4 bg-white dark:bg-gray-800 ${cardHeight}`}
        >
            <p className="font-semibold">{title}</p>
            <div className={`${chartHeight}`}>
                <Line options={chartOptions} data={chartData} />
            </div>
        </div>
    );
}
