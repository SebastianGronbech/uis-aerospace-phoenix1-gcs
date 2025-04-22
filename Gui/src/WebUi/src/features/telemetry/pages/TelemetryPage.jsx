import { EngineDashboard } from "../components/EngineDashboard";

export default function TelemetryDashboard() {
    return (
        <div className="flex items-center justify-center min-h-screen bg-gray-100">
            <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-3xl">
                <h1 className="text-2xl font-bold text-center mb-6">
                    Telemetry Dashboard
                </h1>
                <EngineDashboard />
            </div>
        </div>
    );
}
