// shared/hooks/useSignalR.js
import { useState, useEffect, useCallback } from "react";
import * as signalR from "@microsoft/signalr";

export const useSignalR = ({ hubUrl, accessTokenFactory }) => {
    const [connection, setConnection] = useState(null);
    const [connected, setConnected] = useState(false);

    useEffect(() => {
        const conn = new signalR.HubConnectionBuilder()
            .withUrl(hubUrl, { accessTokenFactory })
            .withAutomaticReconnect()
            .build();

        conn.start()
            .then(() => {
                console.log("✅ SignalR connected");
                setConnected(true);
            })
            .catch(console.error);

        setConnection(conn);

        return () => {
            conn.stop();
        };
    }, [hubUrl]);

    // ✅ Safe listener wrapper
    const on = useCallback((eventName, handler) => {
        if (!connection) return () => {};
        connection.on(eventName, handler);
        return () => connection.off(eventName, handler);
    }, [connection]);

    const send = useCallback((method, data) => {
        if (connection) {
            connection.invoke(method, data).catch(console.error);
        }
    }, [connection]);

    return { connected, on, send };
};
