export default function DonutChart({ pct, size, color, track }) {
  const value = Math.min(100, Math.max(0, Number(pct) || 0));
  const center = size / 2;
  const stroke = size * 0.2;
  const common = {
    cx: center,
    cy: center,
    r: Math.max(1, center - stroke / 2 - 1),
    fill: 'none',
    strokeWidth: stroke,
    strokeLinecap: 'round',
    pathLength: 100,
    transform: `rotate(-90 ${center} ${center})`,
  };

  return (
    <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
      <circle {...common} stroke={track} />
      <circle {...common} stroke={color} strokeDasharray={`${value} ${100 - value}`} />
    </svg>
  );
}