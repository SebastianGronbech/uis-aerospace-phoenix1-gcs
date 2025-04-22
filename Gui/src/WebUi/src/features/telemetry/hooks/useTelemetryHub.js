import { useState, useEffect } from "react";
import { useSignalR } from "@/hooks/useSignalR";

const apiUrl = import.meta.env.VITE_API_URL;

export const useTelemetryHub = () => {
    const [telemetryData, setTelemetryData] = useState(null);
    const [error, setError] = useState(null);
    const [isConnected, setIsConnected] = useState(false);

    const { connection } = useSignalR("http://localhost:5017/hubs/custom", {
        withCredentials: true,
        accessTokenFactory: () => localStorage.getItem("access_token"),
    });

    useEffect(() => {
        const handleTelemetryData = (data) => {
            setTelemetryData(data);
        };

        const handleError = (err) => {
            setError(err);
        };

        if (connection) {
            connection.on("ReceiveTelemetryData", handleTelemetryData);
            connection.on("Error", handleError);
            connection.onclose(() => {
                setIsConnected(false);
            });
            connection.onreconnecting(() => {
                setIsConnected(false);
            });
            connection.onreconnected(() => {
                setIsConnected(true);
            });

            return () => {
                connection.off("ReceiveTelemetryData", handleTelemetryData);
                connection.off("Error", handleError);
            };
        }
    }, [connection]);

    return { telemetryData, error, isConnected };
};
