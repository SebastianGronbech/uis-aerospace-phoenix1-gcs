import { useState, useEffect } from "react";
import { useSignalR } from "../hooks/useSignalR";

const baseUrl = import.meta.env.VITE_API_URL;

export const useTelemetryHub = () => {
    const [telemetryData, setTelemetryData] = useState(null);

    const { connected, on, send } = useSignalR({
        hubUrl: `${baseUrl}/dashboardHub`,
        accessTokenFactory: () => localStorage.getItem("access_token"),
    });

    // Subscribe to SignalR group when connected
    useEffect(() => {
        if (connected) {
            console.log("🛰️ Subscribing to rocket subsystem...");
            send("SubscribeToSubSystem", "rocket");
        }
    }, [connected, send]);

    // Handle incoming telemetry updates
    useEffect(() => {
        const unsubscribe = on("ReceiveSubSystemUpdate", (subSystemId, eventName, data) => {
            console.log("📡 SignalR update received:", subSystemId, eventName, data);

            if (subSystemId === "rocket" && eventName === "telemetry-update") {
                setTelemetryData(data);
            }
        });

        return unsubscribe;
    }, [on]);

    return {
        connected,
        telemetryData,
        send: (command) => send("SendCommand", command),
    };
};
