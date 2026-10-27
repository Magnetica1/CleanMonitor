export default function BarChart({ pct, width, height, color, track }) {
  const value = Math.min(100, Math.max(0, Number(pct) || 0));

  return (
    <div style={{ width, height, borderRadius: height, background: track, overflow: 'hidden' }}>
      <div
        style={{
          width: `${Math.min(100, Math.max(2, value))}%`,
          height: '100%',
          borderRadius: height,
          background: color,
          transition: 'width 700ms cubic-bezier(0.22, 1, 0.36, 1)',
        }}
      />
    </div>
  );
}