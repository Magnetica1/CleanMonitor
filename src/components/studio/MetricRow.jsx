import ChartBlock from '@/components/studio/ChartBlock';
import { coreRows, historyFor, metricDisplay, topMemRows, topRows } from '@/lib/metricDisplay';
import { hexToRgba, metricChart, metricLabel } from '@/lib/widgetCatalog';

export default function MetricRow({ metric, values, layout, style }) {
  const labelStyle = {
    color: style.labelColor,
    fontSize: Math.max(9, style.fontSize - 2),
    letterSpacing: layout.uppercase ? '0.09em' : 'normal',
  };

  const chart = metricChart(metric);
  const chartLayout = { barWidth: layout.barWidth, barHeight: layout.barHeight, graphHeight: layout.graphHeight };
  const series = historyFor(metric, values);
  const second = metric.id === 'net' ? values.netUpHist : null;
  const track = hexToRgba(style.barColor, 0.16);
  const warning = (pct) => style.warnAt > 0 && pct != null && pct >= style.warnAt;
  const chartColour = (pct) => (warning(pct) ? style.warnColor : style.barColor);
  const valueColour = (pct) => (warning(pct) ? style.warnColor : style.textColor);

  const chartFor = (pct) => (
    <ChartBlock
      type={chart}
      pct={pct}
      series={series}
      second={second}
      color={chartColour(pct)}
      track={track}
      layout={chartLayout}
    />
  );

  if (metric.id === 'cores' || metric.id === 'top' || metric.id === 'topmem') {
    const rows =
      metric.id === 'cores' ? coreRows(metric, values) : metric.id === 'top' ? topRows(metric, values) : topMemRows(metric, values);
    return (
      <div style={{ display: 'grid', gap: Math.max(4, layout.gap * 0.6) }}>
        {rows.map((row) => (
          <div key={row.key} style={{ display: 'grid', gap: 4 }}>
            <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between', gap: 12 }}>
              <span style={{ ...labelStyle, letterSpacing: 'normal' }}>{row.label}</span>
              <span style={{ color: valueColour(row.pct), fontVariantNumeric: 'tabular-nums' }}>{row.text}</span>
            </div>
            {chartFor(row.pct)}
          </div>
        ))}
      </div>
    );
  }

  const display = metricDisplay(metric, values);
  const label = metricLabel(metric, layout.uppercase);
  const valueStyle = { color: valueColour(display.pct), fontVariantNumeric: 'tabular-nums' };

  if (layout.labelMode === 'above') {
    return (
      <div style={{ display: 'grid', gap: 5 }}>
        <span style={labelStyle}>{label}</span>
        <span style={{ ...valueStyle, fontSize: style.fontSize + 3, fontWeight: 600 }}>{display.text}</span>
        {chartFor(display.pct)}
      </div>
    );
  }

  if (layout.labelMode === 'inline') {
    return (
      <div style={{ display: 'grid', gap: 5 }}>
        <div style={{ display: 'flex', alignItems: 'baseline', gap: 10 }}>
          <span style={labelStyle}>{label}</span>
          <span style={{ ...valueStyle, fontSize: style.fontSize + 2, fontWeight: 600 }}>{display.text}</span>
        </div>
        {chartFor(display.pct)}
      </div>
    );
  }

  return (
    <div style={{ display: 'grid', gap: 5 }}>
      <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between', gap: 14 }}>
        <span style={labelStyle}>{label}</span>
        <span style={valueStyle}>{display.text}</span>
      </div>
      {chartFor(display.pct)}
    </div>
  );
}