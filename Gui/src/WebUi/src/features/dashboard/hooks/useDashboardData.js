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
    Status10: null, // Ignition
    Status11: null, // Apogee Reached
    Status12: null, // Burnout
    Status13: null, // Main Deployed
    Status14: null, // Simulation
    Status15: null, // Drouge Deployed
    Status16: null, // Drouge Pressure Drop
    Status17: null, // Main Pressure Drop
    Drouge_pressure: null,
    Main_pressure: null,
    Voltage: null,
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
    Status10: null, // Ignition
    Status11: null, // Apogee Reached
    Status12: null, // Burnout
    Status13: null, // Main Deployed
    Status14: null, // Simulation
    Status15: null, // Drouge Deployed
    Status16: null, // Drouge Pressure Drop
    Status17: null, // Main Pressure Drop

    Drouge_pressure: null,
    Main_pressure: null,
    Voltage: null,
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
        if ("Rssi" in signals) latestPacket.current.Rssi = signals.Rssi;
        if ("Status10" in signals) latestPacket.current.Status10 = signals.Status10; // Ignition
        if ("Status11" in signals) latestPacket.current.Status11 = signals.Status11; // Apogee Reached
        if ("Status12" in signals) latestPacket.current.Status12 = signals.Status12; // Burnout
        if ("Status13" in signals) latestPacket.current.Status13 = signals.Status13; // Main Deployed
        if ("Status14" in signals) latestPacket.current.Status14 = signals.Status14; // Simulation
        if ("Status15" in signals) latestPacket.current.Status15 = signals.Status15; // Drouge Deployed
        if ("Status16" in signals) latestPacket.current.Status16 = signals.Status16; // Drouge Pressure Drop
        if ("Status17" in signals) latestPacket.current.Status17 = signals.Status17; // Main Pressure Drop
        if ("Drouge_pressure" in signals) latestPacket.current.Drouge_pressure = signals.Drouge_pressure;
        if ("Main_pressure" in signals) latestPacket.current.Main_pressure = signals.Main_pressure;
        if ("Voltage" in signals) latestPacket.current.Voltage = signals.Voltage;
      }

      // Handle rocket signal-quality for RSSI
      if (subId === "rocket" && eventName === "signal-quality") {
        latestPacket.current.Rssi = payload.Rssi;
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
