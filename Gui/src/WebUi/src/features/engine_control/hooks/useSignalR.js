import { useState, useEffect, useCallback } from "react";
import * as signalR from "@microsoft/signalr";

export const useSignalR = ({ hubUrl, accessTokenFactory }) => {
    const [connection, setConnection] = useState(null);
    const [connected, setConnected] = useState(false);

    useEffect(() => {
        const conn = new signalR.HubConnectionBuilder()
            .withUrl(hubUrl, { accessTokenFactory })
            .withAutomaticReconnect({
                nextRetryDelayInMilliseconds: () => 3000, // try every 3s
            })
            .configureLogging(signalR.LogLevel.Information)
            .build();

        conn.onclose((error) => {
            console.error("🔌 SignalR connection closed:", error);
            setConnected(false);
        });

        conn.onreconnected(() => {
            console.log("🔄 SignalR reconnected");
            setConnected(true);
        });

        conn.onreconnecting((error) => {
            console.warn("♻️ SignalR reconnecting...", error);
            setConnected(false);
        });

        conn.start()
            .then(() => {
                console.log("✅ SignalR connected");
                setConnected(true);
            })
            .catch((err) => {
                console.error("❌ SignalR connection error:", err);
                setConnected(false);
            });

        setConnection(conn);

        return () => {
            conn.stop();
        };
    }, [hubUrl]);

    const on = useCallback((eventName, handler) => {
        if (!connection) return () => {};
        connection.on(eventName, handler);
        return () => connection.off(eventName, handler);
    }, [connection]);

    const send = useCallback((method, data) => {
        if (connection && connection.state === signalR.HubConnectionState.Connected) {
            connection.invoke(method, data).catch(err =>
                console.error(`❌ SignalR send error [${method}]:`, err)
            );
        } else {
            console.warn("⚠️ Cannot send, SignalR not connected.");
        }
    }, [connection]);

    return { connected, on, send };
};
