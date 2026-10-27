const pct = (n) => `${Math.round(n)}%`;
const gib = (n) => `${n.toFixed(1)} GiB`;

const DAYS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

function pad(n) {
  return String(n).padStart(2, '0');
}

export function formatClock(format = '%H:%M') {
  const d = new Date();
  return (format || '%H:%M')
    .replace(/%H/g, pad(d.getHours()))
    .replace(/%M/g, pad(d.getMinutes()))
    .replace(/%S/g, pad(d.getSeconds()))
    .replace(/%a/g, DAYS[d.getDay()])
    .replace(/%d/g, pad(d.getDate()))
    .replace(/%b/g, MONTHS[d.getMonth()])
    .replace(/%Y/g, String(d.getFullYear()));
}

export function uptimeText(minutes) {
  const total = Math.max(0, Math.round(minutes));
  const d = Math.floor(total / 1440);
  const h = Math.floor((total % 1440) / 60);
  const m = total % 60;
  if (d) return `${d}d ${h}h`;
  if (h) return `${h}h ${m}m`;
  return `${m}m`;
}

export function metricDisplay(metric, values) {
  switch (metric.id) {
    case 'cpu':
      return { text: pct(values.cpu), pct: values.cpu, graph: false };
    case 'ram':
      return { text: `${gib(values.ramUsed)} / ${values.ramTotal} GiB`, pct: values.ramPct };
    case 'swap':
      return { text: `${gib(values.swapUsed)} / ${values.swapTotal} GiB`, pct: values.swapPct };
    case 'gpu':
      return { text: pct(values.gpu), pct: values.gpu };
    case 'gputemp':
      return { text: `${Math.round(values.gpuTemp)}°C`, pct: values.gpuTemp };
    case 'disk':
      return { text: `${values.diskUsed} / ${values.diskTotal}`, pct: values.diskPct };
    case 'diski':
      return { text: `R ${values.diskRead}  W ${values.diskWrite}` };
    case 'net':
      return { text: `↓ ${values.netDown.toFixed(1)}  ↑ ${values.netUp.toFixed(1)} MiB/s`, graph: true };
    case 'wifi':
      return { text: pct(values.wifi), pct: values.wifi };
    case 'temp':
      return { text: `${Math.round(values.temp)}°C`, pct: values.temp };
    case 'fan':
      return { text: `${Math.round(values.fan)} rpm` };
    case 'freq':
      return { text: `${values.freq.toFixed(2)} GHz` };
    case 'load':
      return { text: values.load.map((value) => value.toFixed(2)).join('  ') };
    case 'running':
      return { text: `${values.running}` };
    case 'processes':
      return { text: `${values.processes}` };
    case 'transfer':
      return { text: `↓ ${values.totalDown}  ↑ ${values.totalUp}` };
    case 'kernel':
      return { text: values.kernel };
    case 'uptime':
      return { text: uptimeText(values.uptimeMin) };
    case 'battery':
      return { text: pct(values.battery), pct: values.battery };
    case 'clock':
      return { text: formatClock(metric.format) };
    default:
      return { text: '—' };
  }
}

export function historyFor(metric, values) {
  const map = {
    cpu: 'cpuHist',
    ram: 'ramHist',
    swap: 'swapHist',
    gpu: 'gpuHist',
    gputemp: 'gpuTempHist',
    disk: 'diskHist',
    net: 'netDownHist',
    wifi: 'wifiHist',
    temp: 'tempHist',
    fan: 'fanHist',
    freq: 'freqHist',
    load: 'loadHist',
    battery: 'batteryHist',
  };
  const key = map[metric.id];
  return (key && values[key]) || [];
}

export function coreRows(metric, values) {
  const count = Math.max(1, Math.min(16, Number(metric.count) || 4));
  return values.cores.slice(0, count).map((value, i) => ({
    key: `core-${i}`,
    label: `Core ${i + 1}`,
    text: pct(value),
    pct: value,
  }));
}

export function topRows(metric, values) {
  const count = Math.max(1, Math.min(5, Number(metric.count) || 1));
  return values.top.slice(0, count).map((row, i) => ({
    key: `top-${i}`,
    label: row.name,
    text: `${row.pct.toFixed(1)}%`,
    pct: null,
  }));
}

export function topMemRows(metric, values) {
  const count = Math.max(1, Math.min(5, Number(metric.count) || 1));
  return values.topMem.slice(0, count).map((row, i) => ({
    key: `topmem-${i}`,
    label: row.name,
    text: `${row.pct.toFixed(1)}%`,
    pct: null,
  }));
}