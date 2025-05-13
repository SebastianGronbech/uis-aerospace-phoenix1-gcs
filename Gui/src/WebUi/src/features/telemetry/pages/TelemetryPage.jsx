import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";
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

// Register ChartJS modules and plugins
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

// Constants
const MAX_POINTS = 1000;
const WINDOW_SECONDS = 100;
const FRAME_INTERVAL = 1000 / 144; // ~30 FPS

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

// Hook: sliding-window buffer
const useSlidingBuffer = (max = MAX_POINTS) => {
  const [buf, setBuf] = useState([]);
  const push = useCallback(
    (value) =>
      setBuf((prev) =>
        prev.length >= max ? [...prev.slice(1), value] : [...prev, value]
      ),
    [max]
  );
  return [buf, push];
};

// Chart options factory with decimation
const createChartOptions = (yMin, yMax, percent = false) => ({
  responsive: true,
  maintainAspectRatio: false,
  animation: false,
  plugins: {
    decimation: { enabled: true, algorithm: "lttb", samples: 50 },
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
      ticks: { color: isDark() ? "#ffffff" : "#4b5563", callback: percent ? (v) => `${v}%` : undefined },
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

// Keep only recent WINDOW_SECONDS
const filterRecent = (timestamps, values) => {
  const cutoff = Date.now() - WINDOW_SECONDS * 1000;
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

// Memoized ChartCard to avoid re-renders
const MemoChartCard = React.memo(ChartCard);

export default function TelemetryPage() {
  const {
    telemetryData,
    signalData,
    groundTelemetry,
    rocketPacketStats,
    groundPacketStats,
  } = useTelemetryHub();

  const [timestamps, pushTs] = useSlidingBuffer();
  const [rssiBuf, pushRssi] = useSlidingBuffer();
  const [snrBuf, pushSnr] = useSlidingBuffer();
  const [plBuf, pushPl] = useSlidingBuffer();
  const [uplinkBuf, pushUplink] = useSlidingBuffer();
  const [downlinkBuf, pushDownlink] = useSlidingBuffer();

  const lastTelemRef = useRef(0);
  const lastPacketRef = useRef(0);

  // Throttled telemetry updates
  useEffect(() => {
    if (!telemetryData && !signalData) return;
    const nowPerf = performance.now();
    if (nowPerf - lastTelemRef.current < FRAME_INTERVAL) return;
    lastTelemRef.current = nowPerf;

    const now = Date.now();
    let updated = false;

    if (isValidRssi(signalData?.rssi)) {
      pushRssi(round(signalData.rssi));
      updated = true;
    }
    if (isValidSnr(signalData?.snr)) {
      pushSnr(round(signalData.snr));
      updated = true;
    }
    if (isFiniteNumber(telemetryData?.PacketLoss)) {
      pushPl(round(telemetryData.PacketLoss));
      updated = true;
    }
    if (updated) pushTs(now);
  }, [telemetryData, signalData, pushRssi, pushSnr, pushPl, pushTs]);

  // Throttled packet stats updates
  useEffect(() => {
    if (!rocketPacketStats) return;
    const nowPerf = performance.now();
    if (nowPerf - lastPacketRef.current < FRAME_INTERVAL) return;
    lastPacketRef.current = nowPerf;

    const now = Date.now();
    let updated = false;

    const { uplink, downlink } = rocketPacketStats;
    if (isFiniteNumber(uplink)) {
      pushUplink(round(uplink));
      updated = true;
    }
    if (isFiniteNumber(downlink)) {
      pushDownlink(round(downlink));
      updated = true;
    }
    if (uplink > 0 && isFiniteNumber(uplink) && isFiniteNumber(downlink)) {
      const lossPct = Math.min(Math.max(((uplink - downlink) / uplink) * 100, 0), 100);
      pushPl(round(lossPct));
      updated = true;
    }
    if (updated) pushTs(now);
  }, [rocketPacketStats, pushUplink, pushDownlink, pushPl, pushTs]);

  // Filter recent data
  const rssi = useMemo(() => filterRecent(timestamps, rssiBuf), [timestamps, rssiBuf]);
  const snr = useMemo(() => filterRecent(timestamps, snrBuf), [timestamps, snrBuf]);
  const pl = useMemo(() => filterRecent(timestamps, plBuf), [timestamps, plBuf]);
  const uplink = useMemo(() => filterRecent(timestamps, uplinkBuf), [timestamps, uplinkBuf]);
  const downlink = useMemo(() => filterRecent(timestamps, downlinkBuf), [timestamps, downlinkBuf]);

  // Memoized chart datasets
  const rssiData = useMemo(() => ({ labels: rssi.labels, datasets: [{ label: "RSSI", data: rssi.data, borderColor: "#3b82f6", backgroundColor: "rgba(59,130,246,0.2)", tension: 0.1 }] }), [rssi.labels, rssi.data]);
  const snrData = useMemo(() => ({ labels: snr.labels, datasets: [{ label: "SNR", data: snr.data, borderColor: "#10b981", backgroundColor: "rgba(16,185,129,0.2)", tension: 0.1 }] }), [snr.labels, snr.data]);
  const plData = useMemo(() => ({ labels: pl.labels, datasets: [{ label: "Packet Loss (%)", data: pl.data, borderColor: "#f59e0b", backgroundColor: "rgba(245,158,11,0.2)", tension: 0.1 }] }), [pl.labels, pl.data]);
  const uplinkData = useMemo(() => ({ labels: uplink.labels, datasets: [{ label: "Sent", data: uplink.data, borderColor: "#6366f1", backgroundColor: "rgba(99,102,241,0.2)", tension: 0.1 }] }), [uplink.labels, uplink.data]);
  const downlinkData = useMemo(() => ({ labels: downlink.labels, datasets: [{ label: "Received", data: downlink.data, borderColor: "#f87171", backgroundColor: "rgba(248,113,113,0.2)", tension: 0.1 }] }), [downlink.labels, downlink.data]);

  // Status indicators
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

  return (
    <div className="p-6 space-y-6 bg-white dark:bg-gray-900 text-gray-800 dark:text-white flex flex-col h-full">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 flex-grow">
        {/* Charts */}
        <div className="space-y-6 md:col-span-2 flex flex-col">
          <MemoChartCard title="RSSI" chartData={rssiData} chartOptions={rssiOpts} />
          <div className="grid grid-cols-1 grid-rows-4 md:grid-rows-2 md:grid-cols-2 gap-6 flex-grow">
            <MemoChartCard title="SNR - Signal to Noise Ratio" chartData={snrData} chartOptions={snrOpts} />
            <MemoChartCard title="Packet Loss (%)" chartData={plData} chartOptions={percentOpts} />
            <MemoChartCard title="Sent" chartData={uplinkData} chartOptions={autoOpts} />
            <MemoChartCard title="Received" chartData={downlinkData} chartOptions={autoOpts} />
          </div>
        </div>

        {/* Status panes */}
        <div className="grid gap-6 md:grid-cols-2 md:grid-rows-[auto_1fr]">
          <ModuleCard
            moduleTitle="Ground Module"
            packetStatsData={groundPacketStats}
            onReset={() => console.log("Reset Ground")}
            statusItems={groundStatuses}
          />
          <ModuleCard
            moduleTitle="Rocket Module"
            packetStatsData={rocketPacketStats}
            onReset={() => console.log("Reset Rocket")}
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
