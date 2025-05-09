import React from "react";
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend,
} from "chart.js";
import { Line } from "react-chartjs-2";

ChartJS.register(
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend
);

const dummyData = {
    labels: Array.from({ length: 10 }, (_, i) => i.toString()),
    datasets: [
        {
            label: "Value",
            data: [12, 19, 3, 5, 2, 3, 7, 10, 8, 6],
            borderColor: "#3b82f6",
            backgroundColor: "rgba(59, 130, 246, 0.2)",
        },
    ],
};

const chartOptions = {
    responsive: true,
    maintainAspectRatio: false, // Allow charts to fill container height
    plugins: {
        legend: {
            position: "top",
        },
        title: {
            display: false,
        },
    },
};

export default function TelemetryGUI() {
    return (
        <div className="p-6 space-y-6 bg-white dark:bg-gray-900 text-gray-800 dark:text-white">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="space-y-6 md:col-span-2">
                    <div className="border dark:border-gray-700 rounded-2xl shadow p-4 bg-white dark:bg-gray-800 h-64">
                        <p className="font-semibold">RSSI</p>
                        <div className="h-56">
                            <Line options={chartOptions} data={dummyData} />
                        </div>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="border dark:border-gray-700 rounded-2xl shadow p-4 bg-white dark:bg-gray-800 h-60">
                            <p className="font-semibold">SNR</p>
                            <div className="h-52">
                                <Line options={chartOptions} data={dummyData} />
                            </div>
                        </div>
                        <div className="border dark:border-gray-700 rounded-2xl shadow p-4 bg-white dark:bg-gray-800 h-60">
                            <p className="font-semibold">PL</p>
                            <div className="h-52">
                                <Line options={chartOptions} data={dummyData} />
                            </div>
                        </div>
                        <div className="border dark:border-gray-700 rounded-2xl shadow p-4 bg-white dark:bg-gray-800 h-60">
                            <p className="font-semibold">Sendt</p>
                            <div className="h-52">
                                <Line options={chartOptions} data={dummyData} />
                            </div>
                        </div>
                        <div className="border dark:border-gray-700 rounded-2xl shadow p-4 bg-white dark:bg-gray-800 h-60">
                            <p className="font-semibold">Mottatt</p>
                            <div className="h-52">
                                <Line options={chartOptions} data={dummyData} />
                            </div>
                        </div>
                    </div>
                </div>

                <div className="space-y-6">
                    <div className="border dark:border-gray-700 rounded-2xl shadow p-4 bg-white dark:bg-gray-800">
                        <p className="font-semibold">Pakker Mottatt / Sendt</p>
                        <p>Navn ............ Antall</p>
                        <p> - ................. 502</p>
                        <p> - ................. 605</p>
                    </div>
                    <div className="space-y-2">
                        <button className="w-full bg-gray-200 dark:bg-gray-700 rounded py-2 font-semibold text-gray-800 dark:text-white hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors">
                            Reset
                        </button>
                        <button className="w-full bg-gray-200 dark:bg-gray-700 rounded py-2 font-semibold text-gray-800 dark:text-white hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors">
                            Init
                        </button>
                    </div>
                    <div className="border dark:border-gray-700 rounded-2xl shadow p-4 bg-white dark:bg-gray-800">
                        <p className="font-semibold">Status</p>
                        <div className="flex flex-col space-y-1 pl-2">
                            <div className="flex items-center space-x-2">
                                <span className="w-3 h-3 bg-green-500 rounded-full"></span>
                                <span>Navn</span>
                            </div>
                            <div className="flex items-center space-x-2">
                                <span className="w-3 h-3 bg-blue-500 rounded-full"></span>
                                <span>Communication</span>
                            </div>
                        </div>
                    </div>
                    <div className="border dark:border-gray-700 rounded-2xl shadow p-4 bg-white dark:bg-gray-800">
                        <p className="font-semibold">
                            Brukt av telemetrilink [%]
                        </p>
                        <div className="w-full h-40 border dark:border-gray-600 relative mt-2">
                            <div
                                className="absolute bottom-0 w-full bg-blue-500 text-center text-white text-sm"
                                style={{ height: "75%" }}
                            >
                                75%
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
