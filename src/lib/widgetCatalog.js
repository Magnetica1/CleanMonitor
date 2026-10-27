export const FONTS = [
  { id: 'JetBrains Mono', label: 'JetBrains Mono', stack: "'JetBrains Mono', ui-monospace, monospace" },
  { id: 'IBM Plex Mono', label: 'IBM Plex Mono', stack: "'IBM Plex Mono', ui-monospace, monospace" },
  { id: 'Space Grotesk', label: 'Space Grotesk', stack: "'Space Grotesk', ui-sans-serif, sans-serif" },
  { id: 'Inter', label: 'Inter', stack: "'Inter', ui-sans-serif, sans-serif" },
  { id: 'Ubuntu', label: 'Ubuntu', stack: "'Ubuntu', ui-sans-serif, sans-serif" },
  { id: 'Noto Sans Mono', label: 'Noto Sans Mono', stack: "'Noto Sans Mono', ui-monospace, monospace" },
  { id: 'Noto Sans', label: 'Noto Sans', stack: "'Noto Sans', ui-sans-serif, sans-serif" },
  { id: 'Cantarell', label: 'Cantarell', stack: "'Cantarell', ui-sans-serif, sans-serif" },
];

export function fontStack(id) {
  return (FONTS.find((f) => f.id === id) || FONTS[0]).stack;
}

export const METRICS = [
  { id: 'cpu', label: 'CPU usage', hint: 'Total processor load', bar: true, percent: true, line: true, chart: 'bar', enabled: true },
  { id: 'cores', label: 'CPU cores', hint: 'One reading per core', bar: true, percent: true, chart: 'bar', enabled: false, count: { def: 4, max: 16 } },
  { id: 'ram', label: 'Memory', hint: 'RAM in use', bar: true, percent: true, line: true, chart: 'bar', enabled: true },
  {
    id: 'swap',
    label: 'Swap',
    hint: 'Swap file in use',
    bar: true,
    percent: true,
    line: true,
    chart: 'bar',
    enabled: false,
  },
  {
    id: 'gpu',
    label: 'GPU usage',
    hint: 'Graphics card load',
    bar: true,
    percent: true,
    line: true,
    chart: 'bar',
    enabled: false,
    target: { label: 'GPU source', def: '', hint: 'Leave blank to detect your card, or type nvidia' },
  },
  {
    id: 'gputemp',
    label: 'GPU temperature',
    hint: 'Graphics card heat',
    bar: true,
    percent: true,
    line: true,
    chart: 'bar',
    enabled: false,
    target: { label: 'GPU sensor', def: '', hint: 'Leave blank to detect it, or type nvidia, amdgpu, radeon, xe' },
  },
  {
    id: 'temp',
    label: 'CPU temperature',
    hint: 'Read from a hardware sensor',
    bar: true,
    percent: true,
    line: true,
    chart: 'bar',
    enabled: false,
    target: { label: 'Sensor index', def: '0' },
  },
  {
    id: 'fan',
    label: 'Fan speed',
    hint: 'Spinning rate in rpm',
    line: true,
    chart: 'line',
    enabled: false,
    target: { label: 'Sensor device', def: '0', hint: 'A hwmon number, or a module such as k10temp, amdgpu' },
  },
  { id: 'freq', label: 'CPU frequency', hint: 'Current clock speed', line: true, chart: 'line', enabled: false },
  {
    id: 'disk',
    label: 'Disk',
    hint: 'Space used on a mount point',
    bar: true,
    percent: true,
    line: true,
    chart: 'bar',
    enabled: true,
    target: { label: 'Mount point', def: '/' },
  },
  {
    id: 'diski',
    label: 'Disk activity',
    hint: 'Data read and written',
    enabled: false,
    target: { label: 'Disk device', def: '', hint: 'Leave blank for every disk' },
  },
  {
    id: 'net',
    label: 'Network up / down',
    hint: 'Upload and download speed',
    graph: true,
    line: true,
    chart: 'line',
    enabled: true,
    target: { label: 'Interface', def: '', hint: 'Leave blank to total every interface' },
  },
  {
    id: 'wifi',
    label: 'Wi-Fi signal',
    hint: 'Wireless link quality',
    bar: true,
    percent: true,
    line: true,
    chart: 'bar',
    enabled: false,
    target: { label: 'Wireless interface', def: 'wlan0', hint: 'Run: iw dev' },
  },
  { id: 'load', label: 'Load average', hint: '1 minute load average', line: true, chart: 'line', enabled: false },
  { id: 'top', label: 'Top processes', hint: 'Busiest process by CPU', enabled: false, count: { def: 1, max: 5 } },
  { id: 'topmem', label: 'Top memory users', hint: 'Hungriest process by memory', enabled: false, count: { def: 1, max: 5 } },
  { id: 'running', label: 'Running processes', hint: 'Awake processes only', enabled: false },
  { id: 'processes', label: 'Process count', hint: 'Every process and thread', enabled: false },
  {
    id: 'battery',
    label: 'Battery',
    hint: 'Charge level',
    bar: true,
    percent: true,
    line: true,
    chart: 'bar',
    enabled: false,
    target: { label: 'Battery device', def: 'BAT0' },
  },
  { id: 'uptime', label: 'Uptime', hint: 'Time since boot', enabled: false },
  { id: 'transfer', label: 'Data transferred', hint: 'Totals since boot', enabled: false },
  { id: 'kernel', label: 'Kernel', hint: 'Running kernel version', enabled: false },
  { id: 'clock', label: 'Clock', hint: 'Time and date', enabled: false, format: { label: 'Time format', def: '%H:%M' } },
];

export function chartOptions(metric) {
  const def = metricDef(metric.id);
  if (!def) return [];
  const options = [{ value: 'none', label: 'No chart' }];
  if (def.percent) options.push({ value: 'bar', label: 'Bar' });
  if (def.line) options.push({ value: 'line', label: 'Line graph' });
  if (def.percent) {
    options.push({ value: 'gauge', label: 'Gauge' }, { value: 'pie', label: 'Pie' }, { value: 'donut', label: 'Donut' });
  }
  return options;
}

export function metricChart(metric) {
  const def = metricDef(metric.id);
  const allowed = new Set(chartOptions(metric).map((option) => option.value));
  if (metric.chart && allowed.has(metric.chart)) return metric.chart;
  return def?.chart && allowed.has(def.chart) ? def.chart : 'none';
}

export function chartLabel(metric) {
  const value = metricChart(metric);
  return (chartOptions(metric).find((option) => option.value === value) || { label: 'No chart' }).label;
}

export function metricDef(id) {
  return METRICS.find((m) => m.id === id);
}

export function metricLabel(metric, uppercase) {
  const def = metricDef(metric.id);
  const base = (metric.label || '').trim() || (def ? def.label : metric.id);
  return uppercase ? base.toUpperCase() : base;
}

export const CORNERS = [
  { id: 'top_left', label: 'Top left' },
  { id: 'top_middle', label: 'Top centre' },
  { id: 'top_right', label: 'Top right' },
  { id: 'middle_left', label: 'Centre left' },
  { id: 'middle_middle', label: 'Dead centre' },
  { id: 'middle_right', label: 'Centre right' },
  { id: 'bottom_left', label: 'Bottom left' },
  { id: 'bottom_middle', label: 'Bottom centre' },
  { id: 'bottom_right', label: 'Bottom right' },
];

export const PRESETS = [
  {
    id: 'midnight',
    label: 'Midnight',
    style: { bgColor: '#0d0d12', bgOpacity: 78, accentColor: '#7dd3fc', barColor: '#7dd3fc', warnColor: '#ff5f6d', textColor: '#eef0f4', labelColor: '#8b8f9a', font: 'JetBrains Mono' },
  },
  {
    id: 'nordic',
    label: 'Nordic',
    style: { bgColor: '#2e3440', bgOpacity: 84, accentColor: '#88c0d0', barColor: '#88c0d0', warnColor: '#bf616a', textColor: '#eceff4', labelColor: '#9aa4b8', font: 'IBM Plex Mono' },
  },
  {
    id: 'tokyo',
    label: 'Neon Tokyo',
    style: { bgColor: '#16121f', bgOpacity: 76, accentColor: '#ff5fa2', barColor: '#ff5fa2', warnColor: '#ffd166', textColor: '#f4ecff', labelColor: '#9a8fb5', font: 'JetBrains Mono' },
  },
  {
    id: 'terminal',
    label: 'Terminal',
    style: { bgColor: '#04140a', bgOpacity: 74, accentColor: '#4eef7a', barColor: '#4eef7a', warnColor: '#ff5252', textColor: '#d7ffdf', labelColor: '#57a37c', font: 'IBM Plex Mono' },
  },
  {
    id: 'paper',
    label: 'Paper',
    style: { bgColor: '#f7f5f0', bgOpacity: 94, accentColor: '#111111', barColor: '#111111', warnColor: '#c0392b', textColor: '#1b1b1b', labelColor: '#7d7773', font: 'Space Grotesk' },
  },
  {
    id: 'solar',
    label: 'Solar',
    style: { bgColor: '#fdf6e3', bgOpacity: 94, accentColor: '#cb4b16', barColor: '#cb4b16', warnColor: '#dc322f', textColor: '#073642', labelColor: '#8b9a99', font: 'Space Grotesk' },
  },
  {
    id: 'frosted',
    label: 'Frosted',
    style: { bgColor: '#0a0a0a', bgOpacity: 38, accentColor: '#ffffff', barColor: '#ffffff', warnColor: '#ff6b6b', textColor: '#ffffff', labelColor: '#c9c9c9', font: 'Inter' },
  },
  {
    id: 'ubuntu',
    label: 'Ubuntu',
    style: { bgColor: '#300a24', bgOpacity: 88, accentColor: '#f4a63a', barColor: '#f4a63a', warnColor: '#e95420', textColor: '#ffffff', labelColor: '#c9aac0', font: 'Ubuntu' },
  },
];

export const DEFAULT_DESIGN = {
  name: 'Midnight panel',
  metrics: METRICS.map((m) => ({
    id: m.id,
    enabled: !!m.enabled,
    label: '',
    target: m.target ? m.target.def : '',
    count: m.count ? m.count.def : 0,
    format: m.format ? m.format.def : '',
    chart: m.chart || 'none',
  })),
  layout: {
    labelMode: 'left',
    uppercase: true,
    separator: false,
    gap: 10,
    barHeight: 4,
    barWidth: 120,
    graphHeight: 26,
  },
  style: {
    preset: 'midnight',
    bgColor: '#0d0d12',
    bgOpacity: 78,
    bgBlur: 12,
    bgImage: '',
    radius: 16,
    padding: 16,
    borderWidth: 0,
    borderColor: '#ffffff',
    textColor: '#eef0f4',
    labelColor: '#8b8f9a',
    accentColor: '#7dd3fc',
    barColor: '#7dd3fc',
    warnColor: '#ff5f6d',
    warnAt: 80,
    font: 'JetBrains Mono',
    fontSize: 13,
    weight: 500,
    glow: false,
  },
  placement: {
    corner: 'top_right',
    gapX: 36,
    gapY: 44,
    updateInterval: 2,
  },
};

export function cloneDesign(design) {
  return JSON.parse(JSON.stringify(design));
}

export function mergeDesign(saved) {
  const base = cloneDesign(DEFAULT_DESIGN);
  if (!saved || typeof saved !== 'object') return base;

  const chartsOff = saved.layout && saved.layout.showBars === false;
  const layout = { ...base.layout, ...(saved.layout || {}) };
  delete layout.showBars;
  const style = { ...base.style, ...(saved.style || {}) };
  delete style.luaRounded;

  return {
    name: saved.name || base.name,
    metrics: base.metrics.map((m) => {
      const merged = { ...m, ...(saved.metrics || []).find((s) => s.id === m.id) };
      if (chartsOff) merged.chart = 'none';
      return merged;
    }),
    layout,
    style,
    placement: { ...base.placement, ...(saved.placement || {}) },
  };
}

export function hexToRgba(hex, alpha = 1) {
  const clean = (hex || '#000000').replace('#', '').trim();
  const full = clean.length === 3 ? clean.split('').map((c) => c + c).join('') : clean;
  const num = parseInt(full.length === 6 ? full : '000000', 16);
  const r = (num >> 16) & 255;
  const g = (num >> 8) & 255;
  const b = num & 255;
  return `rgba(${r}, ${g}, ${b}, ${alpha})`;
}