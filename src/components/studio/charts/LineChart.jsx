export default function LineChart({ data, second, width, height, color, track }) {
  const series = data && data.length > 1 ? data : [0, 0];
  const other = second && second.length > 1 ? second : null;
  const peak = Math.max(...series, ...(other || [0]), 0.5) * 1.1;

  const points = (values) =>
    values
      .map((value, index) => {
        const x = (index * width) / (values.length - 1 || 1);
        const y = height - Math.min(1, value / peak) * height;
        return `${x.toFixed(1)},${y.toFixed(1)}`;
      })
      .join(' ');

  // the colour stops where the line is: an area under the curve, not a block behind it
  const area = `0,${height} ${points(series)} ${width},${height}`;

  return (
    <svg
      width={width}
      height={height}
      viewBox={`0 0 ${width} ${height}`}
      preserveAspectRatio="none"
      style={{ display: 'block' }}
    >
      <polygon points={area} fill={track} />
      <polyline points={points(series)} fill="none" stroke={color} strokeWidth="1.4" strokeLinejoin="round" strokeLinecap="round" />
      {other && (
        <polyline
          points={points(other)}
          fill="none"
          stroke={color}
          strokeOpacity="0.55"
          strokeWidth="1.2"
          strokeDasharray="3 3"
          strokeLinejoin="round"
          strokeLinecap="round"
        />
      )}
    </svg>
  );
}