import { useState, useEffect, useRef } from "react";
import { useSignalR } from "../hooks/useSignalR";

const baseUrl = import.meta.env.VITE_API_URL;
const WINDOW_MS = 45000; // 45 seconds

const allFieldKeys = [
  "Altitude", "Climbrate", "TotalVelocity",
  "Latitude", "Longitude",
  "Roll", "Pitch", "Yaw",
  "Time", "Date",
  "Status0", "Status1", "Status2", "Status3", "Status4"
];

export const useFlightEstimatorHub = () => {
  const [estimatorFields, setEstimatorFields] = useState({});
  const timestamps = useRef([]);
  const fieldHistory = useRef({});
  const latestPacket = useRef({});

  // Collect incoming CAN packets, update latestPacket
  const { connected, on, send } = useSignalR({
    hubUrl: `${baseUrl}/dashboardHub`,
    accessTokenFactory: () => localStorage.getItem("access_token"),
  });

  useEffect(() => {
    if (!connected) return;

    send("SubscribeToSubSystem", "flight-estimator");

    const unsub = on("ReceiveSubSystemUpdate", (subId, eventName, data) => {
       //console.log("Received data keys:", Object.keys(data));
      if (subId !== "flight-estimator" || eventName !== "estimator-update") return;
      
      // Always update the latest packet (buffer)
      for (const key of allFieldKeys) {
        if (key in data) {
          latestPacket.current[key] = data[key];
        }
      }
    });

    return () => unsub();
  }, [connected, on, send]);

  // Every 1s, commit the latest packet to history and UI
  useEffect(() => {
    const interval = setInterval(() => {
      const now = Date.now();
      timestamps.current.push(now);

      for (const key of allFieldKeys) {
        if (!fieldHistory.current[key]) fieldHistory.current[key] = [];
        // Save the current latestPacket value for each field (or null if never set)
        fieldHistory.current[key].push(latestPacket.current[key] ?? null);
      }

      // Prune old data
      while (timestamps.current.length && (now - timestamps.current[0]) > WINDOW_MS) {
        timestamps.current.shift();
        allFieldKeys.forEach(key => {
          if (fieldHistory.current[key].length) fieldHistory.current[key].shift();
        });
      }

      // Update UI
      setEstimatorFields({ ...latestPacket.current });
    }, 1000); // 1 second
    return () => clearInterval(interval);
  }, []);

  const getChartData = (fieldKey) => {
    const values = fieldHistory.current[fieldKey] || [];
    const timeLabels = timestamps.current.map(ts =>
      new Date(ts).toLocaleTimeString([], {
        hour12: false,
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
      })
    );
    return {
      labels: timeLabels,
      datasets: [
        {
          label: fieldKey,
          data: values,
          borderColor: "#3b82f6",
          backgroundColor: "rgba(59,130,246,0.2)",
          tension: 0.1,
        },
      ],
    };
  };

  const sendCommand = (cmd) => {
    send("SendCommand", cmd);
  };

  return {
    connected,
    estimatorFields,
    getChartData,
    sendCommand,
  };
};
