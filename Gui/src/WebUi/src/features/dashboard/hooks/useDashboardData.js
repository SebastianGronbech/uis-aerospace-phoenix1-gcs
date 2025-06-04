// src/features/dashboard/hooks/useDashboardData.jsx
import { useState, useEffect, useRef } from "react";
import { useSignalR } from "../hooks/useSignalR";

const baseUrl = import.meta.env.VITE_API_URL;

export function useDashboardData() {
  const [dashboardFields, setDashboardFields] = useState({
    Altitude: null,
    TotalVelocity: null,
    Status6: null,
    Rssi: null,
    Status9: null,
    Max_Altitude: null,
    Max_Velocity: null,
  });
  const [telemetryHistory, setTelemetryHistory] = useState([]);
  const latestPacket = useRef({
    Altitude: null,
    TotalVelocity: null,
    Status6: null,
    Rssi: null,
    Status9: null,
    Max_Altitude: null,
    Max_Velocity: null,
  });

  const { connected, on, send } = useSignalR({
    hubUrl: `${baseUrl}/dashboardHub`,
    accessTokenFactory: () => localStorage.getItem("access_token"),
  });

  useEffect(() => {
    if (!connected) return;

    send("SubscribeToSubSystem", "flight-estimator");
    send("SubscribeToSubSystem", "rocket"); // ✅ Subscribing to "rocket" for RSSI

    const unsub = on("ReceiveSubSystemUpdate", (subId, eventName, payload) => {
      // Handle flight-estimator telemetry
      if (subId === "flight-estimator" && eventName === "estimator-update") {
        const signals = payload?.Signals ?? payload;
        if (!signals) return;

        if ("Altitude" in signals) latestPacket.current.Altitude = signals.Altitude;
        if ("TotalVelocity" in signals) latestPacket.current.TotalVelocity = signals.TotalVelocity;
        if ("Status6" in signals) latestPacket.current.Status6 = signals.Status6;
        if ("Status9" in signals) latestPacket.current.Status9 = signals.Status9;
        if ("Max_Altitude" in signals) latestPacket.current.Max_Altitude = signals.Max_Altitude;
        if ("Max_Velocity" in signals) latestPacket.current.Max_Velocity = signals.Max_Velocity;
        if ("rssi" in signals) latestPacket.current.Rssi = round(signals.rssi);
      }

      // Handle rocket signal-quality for RSSI
      if (subId === "rocket" && eventName === "signal-quality") {
        const rssi = round(payload.rssi);
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

  const sendCommand = (cmd) => {
    send("SendCommand", cmd);
  };

  return {
    connected,
    dashboardFields,
    telemetryHistory,
    sendCommand,
  };
}
