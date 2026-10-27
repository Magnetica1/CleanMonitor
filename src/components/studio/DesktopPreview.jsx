import { BatteryFull, Folder, Globe, LayoutGrid, MessageSquare, Volume2, Wifi } from 'lucide-react';
import WidgetCard from '@/components/studio/WidgetCard';

const WALLPAPER =
  'radial-gradient(120% 90% at 12% 6%, rgba(36, 62, 122, 0.85) 0%, transparent 55%), radial-gradient(90% 80% at 86% 10%, rgba(88, 42, 108, 0.8) 0%, transparent 58%), linear-gradient(155deg, #090c15 0%, #141b2e 48%, #0a0d16 100%)';

function placementStyle(corner, gapX, gapY) {
  const [vertical, horizontal] = (corner || 'top_right').split('_');
  const style = {};
  style[vertical === 'middle' ? 'top' : vertical] = vertical === 'middle' ? '50%' : gapY;
  style[horizontal === 'middle' ? 'left' : horizontal] = horizontal === 'middle' ? '50%' : gapX;
  const shifts = [];
  if (vertical === 'middle') shifts.push('translateY(-50%)');
  if (horizontal === 'middle') shifts.push('translateX(-50%)');
  style.transform = shifts.join(' ');
  return style;
}

export default function DesktopPreview({ design, values }) {
  const clock = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

  return (
    <div
      className="relative overflow-hidden rounded-2xl border border-border shadow-[0_40px_90px_-50px_rgba(15,23,42,0.6)]"
      style={{ background: WALLPAPER }}
    >
      <div className="relative min-h-[430px] sm:min-h-[560px]">
        <div className="absolute right-1/4 top-1/4 h-48 w-48 rounded-full bg-white/5 blur-3xl" />
        <div className="absolute inset-x-0 top-0 h-24 bg-gradient-to-b from-black/25 to-transparent" />

        <div className="absolute" style={placementStyle(design.placement.corner, design.placement.gapX, design.placement.gapY)}>
          <WidgetCard design={design} values={values} />
        </div>

        <div className="absolute inset-x-3 bottom-3 flex items-center gap-3 rounded-xl border border-white/10 bg-black/45 px-3 py-1.5 backdrop-blur-md">
          <LayoutGrid className="h-3.5 w-3.5 text-white/70" />
          <div className="flex items-center gap-3 text-white/50">
            <Globe className="h-3.5 w-3.5" />
            <Folder className="h-3.5 w-3.5" />
            <MessageSquare className="h-3.5 w-3.5" />
          </div>
          <div className="ml-auto flex items-center gap-3 text-white/70">
            <Wifi className="h-3.5 w-3.5" />
            <Volume2 className="h-3.5 w-3.5" />
            <BatteryFull className="h-3.5 w-3.5" />
            <span className="font-mono text-[11px] tabular-nums text-white/80">{clock}</span>
          </div>
        </div>
      </div>
    </div>
  );
}