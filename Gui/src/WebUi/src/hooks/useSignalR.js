import { useEffect, useRef, useState, useCallback } from "react";
import { HubConnectionBuilder } from "@microsoft/signalr";

export const useSignalR = ({
    hubUrl,
    accessTokenFactory,
    withCredentials = false,
    automaticReconnect = true,
    configureLogging = "info",
}) => {
    const connectionRef = useRef(null);
    const [connected, setConnected] = useState(false);
    const [error, setError] = useState(null);

    const connect = useCallback(async () => {
        try {
            const connection = new HubConnectionBuilder()
                .withUrl(hubUrl, {
                    accessTokenFactory,
                    withCredentials,
                })
                .withAutomaticReconnect(automaticReconnect)
                .configureLogging(configureLogging)
                .build();

            connection.on("ReceiveMessage", (message) => {
                console.log("Received message:", message);
            });

            connection.onclose(() => {
                setConnected(false);
            });

            await connection.start();
            setConnected(true);
            connectionRef.current = connection;
        } catch (err) {
            setError(err);
        }
    }, [
        hubUrl,
        accessTokenFactory,
        withCredentials,
        automaticReconnect,
        configureLogging,
    ]);

    useEffect(() => {
        connect();

        return () => {
            if (connectionRef.current) {
                connectionRef.current.stop();
            }
        };
    }, [connect]);

    return { connection: connectionRef.current, connected, error };
};
