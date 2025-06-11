// src/features/dashboard/hooks/useDashboardData.jsx
import { useState, useEffect, useRef } from "react";
import { useSignalR } from "../hooks/useSignalR";

const baseUrl = import.meta.env.VITE_API_URL;

export function useEngineData() {
  const [EngineFields, setEngineFields] = useState({
    CalMotors: null, 
    IDLE: null,
    Homing: null,
    Fire: null,
    Abort: null,
    Relief: null,
    Fueling: null,
    ExitMotors: null,

    N2OTank: null,
    ETHTank: null,
    N2OPropellant: null,
    ETHPropellant: null,
    N2OInjector: null,
    ETHInjector: null,
    N2OInjectorTemp: null,
    ETHInjectorTemp: null,
    Pressure: null,
    Temperature: null,
    M1Temp: null,
    M2Temp: null,
    M1Curr: null,
    M2Curr: null,
    M1Pos: null,
    M2Pos: null,
    N2ODen: null,
    ETHDen: null,
    N20FF: null,
    ETHFF: null,
  });
  const [telemetryHistory, setTelemetryHistory] = useState([]);
  const latestPacket = useRef({
    CalMotors: null, 
    IDLE: null,
    Homing: null,
    Fire: null,
    Abort: null,
    Relief: null,
    Fueling: null,
    ExitMotors: null,
    N2OTank: null,
    ETHTank: null,
    N2OPropellant: null,
    ETHPropellant: null,
    N2OInjector: null,
    ETHInjector: null,
    N2OInjectorTemp: null,
    ETHInjectorTemp: null,
    Pressure: null,
    Temperature: null,
    M1Temp: null,
    M2Temp: null,
    M1Curr: null,
    M2Curr: null,
    M1Pos: null,
    M2Pos: null,
    N2ODen: null,
    ETHDen: null,
    N20FF: null,
    ETHFF: null,
  });

  const { connected, on, send } = useSignalR({
    hubUrl: `${baseUrl}/dashboardHub`,
    accessTokenFactory: () => localStorage.getItem("access_token"),
  });

  useEffect(() => {
    if (!connected) return;

    send("SubscribeToSubSystem", "ECU");

    const unsub = on("ReceiveSubSystemUpdate", (subId, eventName, payload) => {
      // Handle flight-estimator telemetry
      if (subId === "ECU" && eventName === "ECU-update") {
        const signals = payload?.Signals ?? payload;
        if (!signals) return;
        if ("CalMotors" in signals) latestPacket.current.CalMotors = signals.CalMotors;
        if ("IDLE" in signals) latestPacket.current.IDLE = signals.IDLE;
        if ("Homing" in signals) latestPacket.current.Homing = signals.Homing;
        if ("Fire" in signals) latestPacket.current.Fire = signals.Fire;
        if ("Abort" in signals) latestPacket.current.Abort = signals.Abort;
        if ("Relief" in signals) latestPacket.current.Relief = signals.Relief;
        if ("Fueling" in signals) latestPacket.current.Fueling = signals.Fueling;
        if ("ExitMotors" in signals) latestPacket.current.ExitMotors = signals.ExitMotors;
        if ("N2OTank" in signals) latestPacket.current.N2OTank = signals.N2OTank;
        if ("ETHTank" in signals) latestPacket.current.ETHTank = signals.ETHTank;
        if ("N2OPropellant" in signals) latestPacket.current.N2OPropellant = signals.N2OPropellant;
        if ("ETHPropellant" in signals) latestPacket.current.ETHPropellant = signals.ETHPropellant;
        if ("N2OInjector" in signals) latestPacket.current.N2OInjector = signals.N2OInjector;
        if ("ETHInjector" in signals) latestPacket.current.ETHInjector = signals.ETHInjector;
        if ("N20InjectorTemp" in signals) latestPacket.current.N20InjectorTemp = signals.N20InjectorTemp;
        if ("ETHInjectorTemp" in signals) latestPacket.current.ETHInjectorTemp = signals.ETHInjectorTemp;
        if ("Pressure" in signals) latestPacket.current.Pressure = signals.Pressure;
        if ("Temperature" in signals) latestPacket.current.Temperature = signals.Temperature;
        if ("M1Temp" in signals) latestPacket.current.M1Temp = signals.M1Temp;
        if ("M2Temp" in signals) latestPacket.current.M2Temp = signals.M2Temp;
        if ("M1Curr" in signals) latestPacket.current.M1Curr = signals.M1Curr;
        if ("M2Curr" in signals) latestPacket.current.M2Curr = signals.M2Curr;
        if ("M1Pos" in signals) latestPacket.current.M1Pos = signals.M1Pos;
        if ("M2Pos" in signals) latestPacket.current.M2Pos = signals.M2Pos;
        if ("N2ODen" in signals) latestPacket.current.N2ODen = signals.N2ODen;
        if ("ETHDen" in signals) latestPacket.current.ETHDen = signals.ETHDen;
        if ("N20FF" in signals) latestPacket.current.N20FF = signals.N20FF;
        if ("ETHFF" in signals) latestPacket.current.ETHFF = signals.ETHFF;
        
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

      setEngineFields({ ...latestPacket.current });
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
    EngineFields,
    telemetryHistory,
    sendCommand,
  };
}
