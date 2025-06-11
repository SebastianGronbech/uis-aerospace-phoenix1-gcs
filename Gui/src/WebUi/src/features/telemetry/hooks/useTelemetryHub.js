import { useState, useEffect, useRef } from "react";
import { useSignalR } from "../hooks/useSignalR";

const baseUrl = import.meta.env.VITE_API_URL;

export const useTelemetryHub = () => {
  const [telemetryData, setTelemetryData] = useState(null);
  const [signalData, setSignalData] = useState(null);
  const [groundTelemetry, setGroundTelemetry] = useState(null);
  const [rocketPacketStats, setRocketPacketStats] = useState({});
  const [groundPacketStats, setGroundPacketStats] = useState({});

  const { connected, on, send } = useSignalR({
    hubUrl: `${baseUrl}/dashboardHub`,
    accessTokenFactory: () => localStorage.getItem("access_token"),
  });

  useEffect(() => {
    if (!connected) return;

    send("SubscribeToSubSystem", "rocket");
    send("SubscribeToSubSystem", "ground");

    const unsubReceive = on("ReceiveSubSystemUpdate", (subId, event, data) => {
      if (subId === "rocket") {
        if (event === "telemetry-update") {
          setTelemetryData(prev => {
            const merged = { ...prev, ...data };
            return shallowEqual(prev, merged) ? prev : merged;
          });
        }
        if (event === "signal-quality") {
          const rssi = data.Rssi;
          const snr = data.Snr;

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

    const unsubNotify = on("ReceiveSystemNotification", msg => {
      console.warn("Sys:", msg);
    });

    return () => {
      unsubReceive();
      unsubNotify();
    };
  }, [connected, on, send]);

  function shallowEqual(a, b) {
    if (a === b) return true;
    if (!a || !b) return false;
    const k1 = Object.keys(a), k2 = Object.keys(b);
    if (k1.length !== k2.length) return false;
    return k1.every(k => a[k] === b[k]);
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
