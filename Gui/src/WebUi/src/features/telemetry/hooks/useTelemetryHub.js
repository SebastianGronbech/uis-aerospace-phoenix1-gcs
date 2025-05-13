import { useState, useEffect, useRef } from "react";
import { useSignalR } from "../hooks/useSignalR";

const baseUrl = import.meta.env.VITE_API_URL;

export const useTelemetryHub = () => {
  const [telemetryData, setTelemetryData] = useState(null);
  const [signalData, setSignalData] = useState(null);
  const [groundTelemetry, setGroundTelemetry] = useState(null);
  const [rocketPacketStats, setRocketPacketStats] = useState({});
  const [groundPacketStats, setGroundPacketStats] = useState({});

  // Destructure once; assume useSignalR itself memoizes these:
  const { connected, on, send } = useSignalR({
    hubUrl: `${baseUrl}/dashboardHub`,
    accessTokenFactory: () => localStorage.getItem("access_token"),
  });

  // Subscribe once when connected flips true
  useEffect(() => {
    if (!connected) return;

    // Tell the hub we want both rocket & ground
    send("SubscribeToSubSystem", "rocket");
    send("SubscribeToSubSystem", "ground");

    // Set up all handlers in one place
    const unsubReceive = on("ReceiveSubSystemUpdate", (subId, event, data) => {
      if (subId === "rocket") {
        if (event === "telemetry-update") {
          setTelemetryData(prev => {
            // shallow-merge + guard
            const merged = { ...prev, ...data };
            return shallowEqual(prev, merged) ? prev : merged;
          });
        }
        if (event === "signal-quality") {
          const rssi = round(data.rssi), snr = round(data.snr);
          setSignalData(prev => {
            const next = { rssi, snr };
            return shallowEqual(prev, next) ? prev : next;
          });
          setTelemetryData(prev => ({ ...prev, Rssi: rssi, Snr: snr }));
        }
        if (event === "packet-counters") {
          setRocketPacketStats(prev =>
            shallowEqual(prev, data) ? prev : data
          );
        }
      }

      if (subId === "ground") {
        if (event === "telemetry-update") {
          setGroundTelemetry(prev => {
            const merged = { ...prev, ...data };
            return shallowEqual(prev, merged) ? prev : merged;
          });
        }
        if (event === "packet-counters") {
          setGroundPacketStats(prev =>
            shallowEqual(prev, data) ? prev : data
          );
        }
      }
    });

    // (optional) system notifications
    const unsubNotify = on("ReceiveSystemNotification", msg => {
      console.warn("Sys:", msg);
    });

    return () => {
      unsubReceive();
      unsubNotify();
    };
  }, [connected, on, send]);

  // Helper to do a shallow equals check (only top-level keys)
  function shallowEqual(a, b) {
    if (a === b) return true;
    if (!a || !b) return false;
    const k1 = Object.keys(a), k2 = Object.keys(b);
    if (k1.length !== k2.length) return false;
    return k1.every(k => a[k] === b[k]);
  }

  function round(n, decimals = 2) {
    return typeof n === "number"
      ? Math.round(n * 10 ** decimals) / 10 ** decimals
      : null;
  }

  return {
    connected,
    telemetryData,
    signalData,
    groundTelemetry,
    rocketPacketStats,
    groundPacketStats,
    send: cmd => send("SendCommand", cmd),
  };
};
