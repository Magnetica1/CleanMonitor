import BarChart from '@/components/studio/charts/BarChart';
import DonutChart from '@/components/studio/charts/DonutChart';
import GaugeChart from '@/components/studio/charts/GaugeChart';
import LineChart from '@/components/studio/charts/LineChart';
import PieChart from '@/components/studio/charts/PieChart';

export default function ChartBlock({ type, pct, series, second, color, track, layout }) {
  if (!type || type === 'none') return null;

  const { barWidth, barHeight, graphHeight } = layout;

  if (type === 'bar') {
    return <BarChart pct={pct} width={barWidth} height={barHeight} color={color} track={track} />;
  }

  if (type === 'line') {
    return <LineChart data={series} second={second} width={barWidth + 30} height={graphHeight} color={color} track={track} />;
  }

  const size = Math.min(96, Math.max(34, Math.round(graphHeight * 1.6)));
  if (type === 'gauge') return <GaugeChart pct={pct} size={size} color={color} track={track} />;
  if (type === 'pie') return <PieChart pct={pct} size={size} color={color} track={track} />;
  if (type === 'donut') return <DonutChart pct={pct} size={size} color={color} track={track} />;
  return null;
}