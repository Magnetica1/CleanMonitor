import { useEffect, useState } from 'react';

const clamp = (value, min, max) => Math.min(max, Math.max(min, value));
const drift = (value, step, min, max) => clamp(value + (Math.random() - 0.5) * step, min, max);
const history = (base) => Array.from({ length: 24 }, () => clamp(base + (Math.random() - 0.5) * base, 0.2, base * 2.4));

const PROCESSES = ['firefox', 'plasmashell', 'kwin_wayland', 'code', 'konsole'];

function seed() {
  return {
    cpu: 32,
    cores: [24, 41, 18, 33],
    ramPct: 43,
    ramUsed: 6.9,
    ramTotal: 16,
    swapPct: 12,
    swapUsed: 0.9,
    swapTotal: 8,
    diskPct: 61,
    diskUsed: '412 GiB',
    diskTotal: '672 GiB',
    diskHist: history(61),
    cpuHist: history(32),
    ramHist: history(43),
    swapHist: history(12),
    gpu: 24,
    gpuHist: history(24),
    gpuTemp: 51,
    gpuTempHist: history(51),
    netDown: 6.4,
    netUp: 0.9,
    netDownHist: history(6),
    netUpHist: history(1.2),
    wifi: 78,
    wifiHist: history(78),
    temp: 48,
    tempHist: history(48),
    fan: 1180,
    fanHist: history(1180),
    freq: 3.4,
    freqHist: history(3.4),
    diskRead: '2.1 MiB/s',
    diskWrite: '340 KiB/s',
    loadHist: history(0.4),
    batteryHist: history(87),
    load: [0.42, 0.38, 0.35],
    uptimeMin: 134,
    running: 4,
    processes: 312,
    top: PROCESSES.map((name, i) => ({ name, pct: 18.4 - i * 3.1 })),
    topMem: PROCESSES.map((name, i) => ({ name, pct: 9.4 - i * 1.6 })),
    totalDown: '12.4 GiB',
    totalUp: '1.8 GiB',
    kernel: '6.8.0-45-generic',
    battery: 87,
  };
}

function nextValues(prev) {
  const ramPct = drift(prev.ramPct, 6, 18, 92);
  const swapPct = drift(prev.swapPct, 4, 0, 60);
  const netDown = drift(prev.netDown, 5, 0.1, 24);
  const netUp = drift(prev.netUp, 2, 0.05, 9);
  const cpu = drift(prev.cpu, 14, 3, 96);
  const temp = drift(prev.temp, 3, 32, 84);
  const battery = drift(prev.battery, 0.2, 5, 100);
  const load = prev.load.map((value) => drift(value, 0.18, 0.02, 3.4));
  const diskPct = drift(prev.diskPct, 0.3, 20, 94);
  const gpu = drift(prev.gpu, 12, 2, 97);
  const gpuTemp = drift(prev.gpuTemp, 3, 34, 86);
  const wifi = drift(prev.wifi, 6, 22, 100);
  const fan = drift(prev.fan, 90, 700, 1900);
  const freq = drift(prev.freq, 0.4, 0.9, 5.2);
  return {
    ...prev,
    cpu,
    cpuHist: [...prev.cpuHist.slice(1), cpu],
    tempHist: [...prev.tempHist.slice(1), temp],
    batteryHist: [...prev.batteryHist.slice(1), battery],
    loadHist: [...prev.loadHist.slice(1), load[0]],
    ramHist: [...prev.ramHist.slice(1), ramPct],
    swapHist: [...prev.swapHist.slice(1), swapPct],
    gpu,
    gpuHist: [...prev.gpuHist.slice(1), gpu],
    gpuTemp,
    gpuTempHist: [...prev.gpuTempHist.slice(1), gpuTemp],
    wifi,
    wifiHist: [...prev.wifiHist.slice(1), wifi],
    fan,
    fanHist: [...prev.fanHist.slice(1), fan],
    freq,
    freqHist: [...prev.freqHist.slice(1), freq],
    diskHist: [...prev.diskHist.slice(1), diskPct],
    cores: prev.cores.map((c) => drift(c, 18, 2, 98)),
    ramPct,
    ramUsed: (ramPct / 100) * prev.ramTotal,
    swapPct,
    swapUsed: (swapPct / 100) * prev.swapTotal,
    diskPct,
    netDown,
    netUp,
    netDownHist: [...prev.netDownHist.slice(1), netDown],
    netUpHist: [...prev.netUpHist.slice(1), netUp],
    temp,
    load,
    uptimeMin: prev.uptimeMin + 1,
    processes: Math.round(drift(prev.processes, 8, 190, 460)),
    top: prev.top
      .map((row) => ({ ...row, pct: clamp(row.pct + (Math.random() - 0.5) * 4, 0.4, 42) }))
      .sort((a, b) => b.pct - a.pct),
    topMem: prev.topMem
      .map((row) => ({ ...row, pct: clamp(row.pct + (Math.random() - 0.5) * 1.4, 0.3, 16) }))
      .sort((a, b) => b.pct - a.pct),
    battery,
  };
}

export default function useSimulatedMetrics() {
  const [values, setValues] = useState(seed);

  useEffect(() => {
    const timer = setInterval(() => setValues(nextValues), 1000);
    return () => clearInterval(timer);
  }, []);

  return values;
}