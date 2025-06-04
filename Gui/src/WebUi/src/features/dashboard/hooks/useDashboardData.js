// Install the Chart.js and React wrapper if you haven’t already:
// npm install chart.js react-chartjs-2

// src/features/dashboard/hooks/useDashboardData.jsx
import { useState, useEffect, useRef, useCallback } from "react";
import { useSignalR } from "../hooks/useSignalR";

const baseUrl = import.meta.env.VITE_API_URL;

export function useDashboardData() {
  // Holds the latest telemetry fields: Altitude, TotalVelocity, GPSFix, Rssi
  const [dashboardFields, setDashboardFields] = useState({
    Altitude: null,
    TotalVelocity: null,
    GPSFix: null,
    Rssi: null,
  });
  // Holds a rolling history of telemetry points
  const [telemetryHistory, setTelemetryHistory] = useState([]);
  const latestPacket = useRef({
    Altitude: null,
    TotalVelocity: null,
    GPSFix: null,
    Rssi: null,
  });

  const { connected, on, send } = useSignalR({
    hubUrl: `${baseUrl}/dashboardHub`,
    accessTokenFactory: () => localStorage.getItem("access_token"),
  });

  useEffect(() => {
    if (!connected) return;
    send("SubscribeToSubSystem", "rocket");

    const unsub = on("ReceiveSubSystemUpdate", (subId, eventName, data) => {
      if (subId !== "rocket") return;

      if (eventName === "telemetry-update") {
        const keys = ["Altitude", "TotalVelocity", "GPSFix"];
        let updated = false;
        const next = { ...latestPacket.current };
        keys.forEach((key) => {
          if (key in data) {
            next[key] = data[key];
            updated = true;
          }
        });
        if (updated) {
          latestPacket.current = next;
        }
      }

      if (eventName === "signal-quality") {
        const rssi = round(data.rssi);
        latestPacket.current.Rssi = rssi;
      }
    });

    return () => unsub();
  }, [connected, on, send]);

  useEffect(() => {
    const interval = setInterval(() => {
      const now = new Date();
      const point = {
        timestamp: now.toLocaleTimeString("en-GB", { hour12: false }),
        Altitude: latestPacket.current.Altitude,
        TotalVelocity: latestPacket.current.TotalVelocity,
        Rssi: latestPacket.current.Rssi,
      };
      setDashboardFields({ ...latestPacket.current });
      setTelemetryHistory((prev) => {
        const next = [...prev, point];
        // Keep only the last 60 points
        if (next.length > 60) next.shift();
        return next;
      });
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  function round(n, decimals = 2) {
    return typeof n === "number"
      ? Math.round(n * 10 ** decimals) / 10 ** decimals
      : null;
  }

  const sendCommand = useCallback(
    (cmd) => {
      send("SendCommand", cmd);
    },
    [send]
  );

  return {
    connected,
    dashboardFields,    // { Altitude, TotalVelocity, GPSFix, Rssi }
    telemetryHistory,   // [{ timestamp, Altitude, TotalVelocity, Rssi }, …]
    sendCommand,
  };
}
