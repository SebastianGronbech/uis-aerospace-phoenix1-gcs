import React, { useEffect, useMemo, useRef } from "react";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Decimation
} from "chart.js";
import ChartCard from "../components/ChartCard";
import ModuleCard from "../components/ModuleCard";
import UsageBar from "../components/UsageBar";
import { useTelemetryHub } from "../hooks/useTelemetryHub";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Decimation
);

const MAX_POINTS = 100;
const FRAME_INTERVAL = 200;

const isDark = () => document.documentElement.classList.contains("dark");

const round = (val, decimals = 2) => {
  const factor = 10 ** decimals;
  return Math.round(val * factor) / factor;
};

const isFiniteNumber = (n) => typeof n === "number" && isFinite(n);
const isValidRssi = (n) => isFiniteNumber(n) && n > -200 && n < 100;
const isValidSnr = (n) => isFiniteNumber(n) && n > -50 && n < 50;

const formatTime = (ts) =>
  new Date(ts).toLocaleTimeString([], {
    hour12: false,
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
  });

const filterRecent = (timestamps, values) => {
  const cutoff = Date.now() - 100 * 1000;
  const labels = [];
  const data = [];
  for (let i = timestamps.length - 1; i >= 0; i--) {
    const ts = timestamps[i];
    if (ts < cutoff) break;
    labels.unshift(formatTime(ts));
    data.unshift(values[i]);
  }
  return { labels, data };
};

const createChartOptions = (yMin, yMax, percent = false) => ({
  responsive: true,
  maintainAspectRatio: false,
  animation: false,
  plugins: {
    decimation: {
      enabled: true,
      algorithm: 'lttb',
      samples: 50,
      threshold: 200
    },
    legend: { position: "top" },
    title: { display: false },
  },
  scales: {
    x: {
      ticks: {
        color: isDark() ? "#ffffff" : "#4b5563",
        autoSkip: true,
        maxTicksLimit: 15,
        callback(value, index) {
          return index < this.chart.data.labels.length
            ? this.getLabelForValue(value)
            : null;
        },
      },
      grid: { color: "rgba(255,255,255,0.1)" },
      bounds: "data",
      offset: false,
      grace: 0,
    },
    y: {
      min: yMin,
      max: yMax,
      ticks: {
        color: isDark() ? "#ffffff" : "#4b5563",
        callback: percent ? (v) => `${v}%` : undefined
      },
      grid: { color: "rgba(255,255,255,0.1)" },
    },
  },
  layout: { padding: { right: 0 } },
  resizeDelay: 0,
});

const rssiOpts = createChartOptions(-100, 100);
const snrOpts = createChartOptions(-50, 50);
const percentOpts = createChartOptions(0, 100, true);
const autoOpts = createChartOptions();

export default function TelemetryPage() {
  const {
    telemetryData,
    signalData,
    groundTelemetry,
    rocketPacketStats,
    groundPacketStats,
  } = useTelemetryHub();

  const timestampsRef = useRef([]);
  const rssiRef = useRef([]);
  const snrRef = useRef([]);
  const plRef = useRef([]);
  const uplinkRef = useRef([]);
  const downlinkRef = useRef([]);

  const lastTelemRef = useRef(0);
  const lastPacketRef = useRef(0);

  const pushSample = (ref, value) => {
    const arr = ref.current;
    arr.push(value);
    if (arr.length > MAX_POINTS) arr.shift();
  };

  useEffect(() => {
    if (!telemetryData && !signalData) return;
    const nowPerf = performance.now();
    if (nowPerf - lastTelemRef.current < FRAME_INTERVAL) return;
    lastTelemRef.current = nowPerf;

    const now = Date.now();
    let updated = false;

    if (isValidRssi(signalData?.rssi)) {
      pushSample(rssiRef, round(signalData.rssi));
      updated = true;
    }
    if (isValidSnr(signalData?.snr)) {
      pushSample(snrRef, round(signalData.snr));
      updated = true;
    }
    if (isFiniteNumber(telemetryData?.PacketLoss)) {
      pushSample(plRef, round(telemetryData.PacketLoss));
      updated = true;
    }
    if (updated) pushSample(timestampsRef, now);
  }, [telemetryData, signalData]);

  useEffect(() => {
    if (!rocketPacketStats) return;
    const nowPerf = performance.now();
    if (nowPerf - lastPacketRef.current < FRAME_INTERVAL) return;
    lastPacketRef.current = nowPerf;

    const now = Date.now();
    let updated = false;

    const { uplink, downlink } = rocketPacketStats;
    if (isFiniteNumber(uplink)) {
      pushSample(uplinkRef, round(uplink));
      updated = true;
    }
    if (isFiniteNumber(downlink)) {
      pushSample(downlinkRef, round(downlink));
      updated = true;
    }
    if (uplink > 0 && isFiniteNumber(uplink) && isFiniteNumber(downlink)) {
      const lossPct = Math.min(Math.max(((uplink - downlink) / uplink) * 100, 0), 100);
      pushSample(plRef, round(lossPct));
      updated = true;
    }
    if (updated) pushSample(timestampsRef, now);
  }, [rocketPacketStats]);

  const rssiData = useMemo(() => {
    const { labels, data } = filterRecent(timestampsRef.current, rssiRef.current);
    return {
      labels,
      datasets: [{
        label: "RSSI",
        data,
        borderColor: "#3b82f6",
        backgroundColor: "rgba(59,130,246,0.2)",
        tension: 0.1
      }]
    };
  }, [telemetryData]);

  const snrData = useMemo(() => {
    const { labels, data } = filterRecent(timestampsRef.current, snrRef.current);
    return {
      labels,
      datasets: [{
        label: "SNR",
        data,
        borderColor: "#10b981",
        backgroundColor: "rgba(16,185,129,0.2)",
        tension: 0.1
      }]
    };
  }, [telemetryData]);

  const plData = useMemo(() => {
    const { labels, data } = filterRecent(timestampsRef.current, plRef.current);
    return {
      labels,
      datasets: [{
        label: "Packet Loss (%)",
        data,
        borderColor: "#f59e0b",
        backgroundColor: "rgba(245,158,11,0.2)",
        tension: 0.1
      }]
    };
  }, [telemetryData]);

  const uplinkData = useMemo(() => {
    const { labels, data } = filterRecent(timestampsRef.current, uplinkRef.current);
    return {
      labels,
      datasets: [{
        label: "Sent",
        data,
        borderColor: "#6366f1",
        backgroundColor: "rgba(99,102,241,0.2)",
        tension: 0.1
      }]
    };
  }, [telemetryData]);

  const downlinkData = useMemo(() => {
    const { labels, data } = filterRecent(timestampsRef.current, downlinkRef.current);
    return {
      labels,
      datasets: [{
        label: "Received",
        data,
        borderColor: "#f87171",
        backgroundColor: "rgba(248,113,113,0.2)",
        tension: 0.1
      }]
    };
  }, [telemetryData]);

  const rocketStatuses = useMemo(() => telemetryData ? [
    { label: "Running", isOn: telemetryData.IsRunning },
    { label: "Not Frozen", isOn: !telemetryData.IsFrozen },
    { label: "Node", isOn: telemetryData.IsNode },
    { label: "CAN RX OK", isOn: !telemetryData.IsCanRcFull },
    { label: "CAN TX OK", isOn: !telemetryData.IsCanTxFull },
    { label: "Serial TX OK", isOn: !telemetryData.IsSerialTxFull },
    { label: "Serial RX OK", isOn: !telemetryData.IsSerialRxFull },
  ] : [], [telemetryData]);

  const groundStatuses = useMemo(() => groundTelemetry ? [
    { label: "Running", isOn: groundTelemetry.IsRunning },
    { label: "Not Frozen", isOn: !groundTelemetry.IsFrozen },
    { label: "Node", isOn: groundTelemetry.IsNode },
    { label: "CAN RX OK", isOn: !groundTelemetry.IsCanRxFull },
    { label: "CAN TX OK", isOn: !groundTelemetry.IsCanTxFull },
    { label: "Serial TX OK", isOn: !groundTelemetry.IsSerialTxFull },
    { label: "Serial RX OK", isOn: !groundTelemetry.IsSerialRxFull },
  ] : [], [groundTelemetry]);

  const handleReset = async (publicId) => {
  try {
    const response = await fetch(`http://localhost:5017/api/commands/${publicId}/send`, {
      method: "POST",
    });

    if (!response.ok) throw new Error("Failed to send command");

    const result = await response.text(); // use text() instead of json()
    console.log("Command sent:", result);
  } catch (error) {
    console.error("API Error:", error);
  }
};



  return (
    <div className="p-6 space-y-6 bg-white dark:bg-gray-900 text-gray-800 dark:text-white flex flex-col h-full">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 flex-grow">
        <div className="space-y-6 md:col-span-2 flex flex-col">
          <ChartCard title="RSSI" chartData={rssiData} chartOptions={rssiOpts} />
          <div className="grid grid-cols-1 grid-rows-4 md:grid-rows-2 md:grid-cols-2 gap-6 flex-grow">
            <ChartCard title="SNR - Signal to Noise Ratio" chartData={snrData} chartOptions={snrOpts} />
            <ChartCard title="Packet Loss (%)" chartData={plData} chartOptions={percentOpts} />
            <ChartCard title="Sent" chartData={uplinkData} chartOptions={autoOpts} />
            <ChartCard title="Received" chartData={downlinkData} chartOptions={autoOpts} />
          </div>
        </div>
        <div className="grid gap-6 md:grid-cols-2 md:grid-rows-[auto_1fr]">
          <ModuleCard
            moduleTitle="Ground Module"
            packetStatsData={groundPacketStats}
            onReset={() => handleReset(324)} // publicId = 324
            statusItems={groundStatuses}
          />

          <ModuleCard
            moduleTitle="Rocket Module"
            packetStatsData={rocketPacketStats}
            onReset={() => handleReset(304)} // publicId = 304
            statusItems={rocketStatuses}
          />

          <div className="md:col-span-2">
            <UsageBar title="Telemetrilink Utnyttelse [%]" usagePercentage={75} />
          </div>
        </div>
      </div>
    </div>
  );
}
