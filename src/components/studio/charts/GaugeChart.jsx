function arcPath(cx, cy, radius, from, to) {
  const point = (angle) => {
    const radians = (angle * Math.PI) / 180;
    return [cx + radius * Math.cos(radians), cy + radius * Math.sin(radians)];
  };
  const [startX, startY] = point(from);
  const [endX, endY] = point(to);
  const large = to - from > 180 ? 1 : 0;
  return `M ${startX.toFixed(2)} ${startY.toFixed(2)} A ${radius} ${radius} 0 ${large} 1 ${endX.toFixed(2)} ${endY.toFixed(2)}`;
}

export default function GaugeChart({ pct, size, color, track }) {
  const value = Math.min(100, Math.max(0, Number(pct) || 0));
  const stroke = Math.max(3, size * 0.09);
  const radius = size / 2 - stroke;
  const path = arcPath(size / 2, size / 2, radius, 135, 405);

  return (
    <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
      <path d={path} fill="none" stroke={track} strokeWidth={stroke} strokeLinecap="round" pathLength="100" />
      <path
        d={path}
        fill="none"
        stroke={color}
        strokeWidth={stroke}
        strokeLinecap="round"
        pathLength="100"
        strokeDasharray={`${value} ${100 - value}`}
      />
    </svg>
  );
}