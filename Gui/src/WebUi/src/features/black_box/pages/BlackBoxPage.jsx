import { useState, useEffect } from "react";
import { useBlackBoxHub } from "../hooks/useBlackBockHub";

function BlackBoxPage() {
    const { blackBoxData, connected } = useBlackBoxHub();

    const [systemStatus, setSystemStatus] = useState({
        overall: "operational",
        storage: { used: 45, total: 1000 }, // GB
        recording: true,
        lastBackup: new Date(Date.now() - 2 * 60 * 60 * 1000), // 2 hours ago
    });

    // Create cameras array based on real telemetry data
    const cameras = [
        {
            id: "CAM1",
            name: "Front Camera",
            status: blackBoxData?.CAM1Power ? "online" : "offline",
            recording: blackBoxData?.IsCAM1Recording || false,
            resolution: "4K",
        },
        {
            id: "CAM2",
            name: "Side Camera",
            status: blackBoxData?.CAM2Power ? "online" : "offline",
            recording: blackBoxData?.IsCAM2Recording || false,
            resolution: "1080p",
        },
        {
            id: "CAM3",
            name: "Rear Camera",
            status: blackBoxData?.CAM3Power ? "online" : "offline",
            recording: blackBoxData?.IsCAM3Recording || false,
            resolution: "1080p",
        },
    ];

    const getStatusColor = (status, isRecording = false) => {
        if (status === "offline") return "bg-red-500";
        if (status === "warning") return "bg-yellow-500";
        if (status === "online" && isRecording)
            return "bg-red-600 animate-pulse";
        if (status === "online") return "bg-green-500";
        return "bg-gray-400";
    };

    const formatTimeAgo = (date) => {
        const now = new Date();
        const diffInMinutes = Math.floor((now - date) / (1000 * 60));
        if (diffInMinutes < 60) return `${diffInMinutes}m ago`;
        const diffInHours = Math.floor(diffInMinutes / 60);
        return `${diffInHours}h ago`;
    };

    return (
        <div className="flex flex-col flex-grow  p-6 bg-gray-50 dark:bg-gray-900 space-y-6">
            {/* Show connection status warning if not connected or no data */}
            {(!connected || !blackBoxData) && (
                <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg p-4">
                    <div className="flex items-center">
                        <div className="w-4 h-4 rounded-full bg-yellow-500 mr-3"></div>
                        <p className="text-yellow-800 dark:text-yellow-200 text-sm">
                            {!connected
                                ? "Not connected to telemetry system"
                                : "Waiting for black box telemetry data..."}
                        </p>
                    </div>
                </div>
            )}

            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
                            Black Box System
                        </h1>
                        <p className="text-gray-600 dark:text-gray-400">
                            Real-time monitoring and control of aircraft
                            recording systems
                        </p>
                    </div>
                    <div className="flex items-center space-x-2">
                        <div
                            className={`w-3 h-3 rounded-full ${
                                connected
                                    ? getStatusColor("online")
                                    : getStatusColor("offline")
                            }`}
                        ></div>
                        <span className="text-sm font-medium text-gray-700 dark:text-gray-300 capitalize">
                            {connected ? "Connected" : "Disconnected"}
                        </span>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Camera Status Cards */}
                <div className="lg:col-span-2 space-y-4">
                    <div>
                        <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
                            Camera Systems
                        </h2>

                        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
                            {cameras.map((camera) => (
                                <div
                                    key={camera.id}
                                    className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-5 hover:shadow-md transition-shadow"
                                >
                                    <div className="flex items-center justify-between mb-3">
                                        <h3 className="font-semibold text-gray-900 dark:text-white">
                                            {camera.name}
                                        </h3>
                                        <span className="text-xs font-medium px-2 py-1 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded">
                                            {camera.id}
                                        </span>
                                    </div>

                                    <div className="space-y-3">
                                        <div className="flex items-center justify-between">
                                            <div className="flex items-center space-x-2">
                                                <div
                                                    className={`w-2 h-2 rounded-full ${getStatusColor(
                                                        camera.status
                                                    )}`}
                                                ></div>
                                                <span className="text-sm text-gray-600 dark:text-gray-400">
                                                    Status
                                                </span>
                                            </div>
                                            <span className="text-sm font-medium text-gray-900 dark:text-white capitalize">
                                                {camera.status}
                                            </span>
                                        </div>

                                        <div className="flex items-center justify-between">
                                            <div className="flex items-center space-x-2">
                                                <div
                                                    className={`w-2 h-2 rounded-full ${getStatusColor(
                                                        camera.status,
                                                        camera.recording
                                                    )}`}
                                                ></div>
                                                <span className="text-sm text-gray-600 dark:text-gray-400">
                                                    Recording
                                                </span>
                                            </div>
                                            <span className="text-sm font-medium text-gray-900 dark:text-white">
                                                {camera.recording
                                                    ? "Active"
                                                    : "Inactive"}
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    <div>
                        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-5 hover:shadow-md transition-shadow">
                            <div className="flex justify-between">
                                <div className="flex items-center space-x-3">
                                    <div
                                        className={`w-2 h-2 rounded-full ${
                                            blackBoxData?.IsReceivingCANData
                                                ? "bg-green-500"
                                                : "bg-red-500"
                                        }`}
                                    ></div>
                                    <span className="text-sm text-gray-600 dark:text-gray-400">
                                        Receiving CAN-Data
                                    </span>
                                    <span className="text-xs font-medium text-gray-900 dark:text-white">
                                        {blackBoxData?.IsReceivingCANData
                                            ? "Active"
                                            : "Inactive"}
                                    </span>
                                </div>

                                <div className="flex items-center space-x-3">
                                    <div
                                        className={`w-2 h-2 rounded-full ${
                                            blackBoxData?.CSMURecording
                                                ? "bg-red-600 animate-pulse"
                                                : "bg-gray-400"
                                        }`}
                                    ></div>
                                    <span className="text-sm text-gray-600 dark:text-gray-400">
                                        CSMU Recording
                                    </span>
                                    <span className="text-xs font-medium text-gray-900 dark:text-white">
                                        {blackBoxData?.CSMURecording
                                            ? "Active"
                                            : "Inactive"}
                                    </span>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div>
                        <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
                            STM32
                        </h2>
                        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-5 hover:shadow-md transition-shadow">
                            <button className="w-full bg-yellow-500 hover:bg-yellow-600 text-white font-medium py-2 px-4 rounded-lg transition-colors">
                                Reboot STM32
                            </button>
                        </div>
                    </div>

                    <div>
                        <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
                            GoPro
                        </h2>
                        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-5 hover:shadow-md transition-shadow">
                            <button
                                className={`w-full ${
                                    systemStatus.recording
                                        ? "bg-red-600 hover:bg-red-700"
                                        : "bg-green-600 hover:bg-green-700"
                                } text-white font-medium py-2 px-4 rounded-lg transition-colors`}
                            >
                                {systemStatus.recording
                                    ? "Stop Recording"
                                    : "Start Recording"}
                            </button>
                        </div>
                    </div>

                    <div>
                        <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
                            Minnekrets
                        </h2>
                        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-5 hover:shadow-md transition-shadow flex  space-x-4">
                            <button
                                className={`w-full ${
                                    systemStatus.recording
                                        ? "bg-red-600 hover:bg-red-700"
                                        : "bg-green-600 hover:bg-green-700"
                                } text-white font-medium py-2 px-4 rounded-lg transition-colors`}
                            >
                                {systemStatus.recording
                                    ? "Stop Recording"
                                    : "Start Recording"}
                            </button>

                            <button className="w-full bg-yellow-500 hover:bg-yellow-600 text-white font-medium py-2 px-4 rounded-lg transition-colors">
                                Delete Data
                            </button>

                            <button
                                className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-lg transition-colors"
                                onClick={() =>
                                    console.log("Rebooting system...")
                                }
                            >
                                Reboot System
                            </button>
                        </div>
                    </div>
                </div>

                <div className="space-y-6">
                    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-5">
                        <h3 className="font-semibold text-gray-900 dark:text-white mb-4">
                            Recording Controls
                        </h3>

                        <div className="space-y-3">
                            <button
                                className={`w-full ${
                                    systemStatus.recording
                                        ? "bg-red-600 hover:bg-red-700"
                                        : "bg-green-600 hover:bg-green-700"
                                } text-white font-medium py-2 px-4 rounded-lg transition-colors`}
                            >
                                {systemStatus.recording
                                    ? "Stop Recording"
                                    : "Start Recording"}
                            </button>

                            <button className="w-full bg-yellow-500 hover:bg-yellow-600 text-white font-medium py-2 px-4 rounded-lg transition-colors">
                                Delete Data
                            </button>

                            <button
                                className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-lg transition-colors"
                                onClick={() =>
                                    console.log("Rebooting system...")
                                }
                            >
                                Reboot System
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default BlackBoxPage;
