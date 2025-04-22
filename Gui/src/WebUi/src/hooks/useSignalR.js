import { useEffect, useRef, useState } from "react";
import { HubConnectionBuilder, HubConnection } from "@microsoft/signalr";

export const useSignalR = (url, options) => {
    const [connection, setConnection] = useState(null);
    const [error, setError] = useState(null);
    const [isConnected, setIsConnected] = useState(false);
    const connectionRef = useRef(null);

    useEffect(() => {
        const connect = async () => {
            try {
                const newConnection = new HubConnectionBuilder()
                    .withUrl(url, options)
                    // .withAutomaticReconnect()
                    .build();

                await newConnection.start();
                setConnection(newConnection);
                setIsConnected(true);
            } catch (err) {
                setError(err);
            }
        };

        connect();

        return () => {
            if (connectionRef.current) {
                connectionRef.current.stop();
            }
        };
    }, [url, options]);

    useEffect(() => {
        if (connection) {
            connectionRef.current = connection;

            connection.onclose(() => {
                setIsConnected(false);
            });

            connection.onreconnecting(() => {
                setIsConnected(false);
            });

            connection.onreconnected(() => {
                setIsConnected(true);
            });
        }
    }, [connection]);
    return { connection, error, isConnected };
};
