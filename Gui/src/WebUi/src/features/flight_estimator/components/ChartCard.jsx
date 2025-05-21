import React from "react";
import { Line } from "react-chartjs-2";

const ChartCard = ({ title, fieldKey, getChartData, chartOptions }) => {
  const chartData = getChartData?.(fieldKey) ?? {
    labels: [],
    datasets: [],
  };
 

  return (
    <div className="border dark:border-gray-700 rounded-2xl shadow p-4 bg-white dark:bg-gray-800 flex flex-col flex-grow">
      <p className="font-semibold text-white">{title}</p>
      <div className="h-full">
        <Line options={chartOptions} data={chartData} />
      </div>
    </div>
  );
};

export default ChartCard;
