import { ColorRow, SelectRow, SliderRow, SwitchRow } from '@/components/studio/controls';
import ImagePicker from '@/components/studio/ImagePicker';
import { FONTS, PRESETS, hexToRgba } from '@/lib/widgetCatalog';
import { PLASMA_THEMES } from '@/lib/plasmaThemes';

const FONT_OPTIONS = FONTS.map((font) => ({ value: font.id, label: font.label }));
const WEIGHT_OPTIONS = [
  { value: '400', label: 'Regular' },
  { value: '500', label: 'Medium' },
  { value: '600', label: 'Semi bold' },
  { value: '700', label: 'Bold' },
];

function PresetGrid({ items, active, onPick }) {
  return (
    <div className="grid grid-cols-2 gap-2">
      {items.map((preset) => (
        <button
          key={preset.id}
          type="button"
          onClick={() => onPick(preset)}
          className={`flex items-center gap-2 rounded-xl border px-3 py-2 text-left text-xs font-medium transition-colors ${
            active === preset.id ? 'border-foreground/40 bg-card shadow-sm' : 'border-border bg-card/60 hover:border-foreground/25'
          }`}
        >
          <span
            className="h-4 w-4 shrink-0 rounded-full ring-2"
            style={{ background: preset.style.accentColor, boxShadow: `0 0 0 3px ${hexToRgba(preset.style.bgColor, 0.75)}` }}
          />
          {preset.label}
        </button>
      ))}
    </div>
  );
}

export default function StyleTab({ design, onStyle, onLayout, onPreset }) {
  const { style, layout } = design;

  return (
    <div className="space-y-5">
      <section className="space-y-3">
        <h3 className="font-heading text-xs font-semibold uppercase tracking-wide text-muted-foreground">Plasma themes</h3>
        <PresetGrid items={PLASMA_THEMES} active={style.preset} onPick={onPreset} />
        <p className="text-[11px] leading-snug text-muted-foreground">
          Close, but not exact: the settings app on your desktop copies your real Plasma colours and font with one click.
        </p>
      </section>

      <section className="space-y-3 border-t border-border pt-5">
        <h3 className="font-heading text-xs font-semibold uppercase tracking-wide text-muted-foreground">Presets</h3>
        <PresetGrid items={PRESETS} active={style.preset} onPick={onPreset} />
      </section>

      <section className="space-y-4 border-t border-border pt-5">
        <h3 className="font-heading text-xs font-semibold uppercase tracking-wide text-muted-foreground">Background</h3>
        <ColorRow label="Panel" value={style.bgColor} onChange={(value) => onStyle({ bgColor: value, preset: 'custom' })} />
        <SliderRow label="Solidity" value={style.bgOpacity} min={0} max={100} suffix="%" onChange={(value) => onStyle({ bgOpacity: value })} />
        <SliderRow label="Blur" value={style.bgBlur} min={0} max={24} suffix="px" onChange={(value) => onStyle({ bgBlur: value })} />
        <ImagePicker value={style.bgImage} onChange={(value) => onStyle({ bgImage: value })} />
        <SliderRow label="Corner radius" value={style.radius} min={0} max={40} suffix="px" onChange={(value) => onStyle({ radius: value })} />
        <SliderRow label="Padding" value={style.padding} min={0} max={40} suffix="px" onChange={(value) => onStyle({ padding: value })} />
      </section>

      <section className="space-y-4 border-t border-border pt-5">
        <h3 className="font-heading text-xs font-semibold uppercase tracking-wide text-muted-foreground">Bars and charts</h3>
        <ColorRow label="Bars" value={style.barColor} onChange={(value) => onStyle({ barColor: value, preset: 'custom' })} />
        <ColorRow label="High use" value={style.warnColor} onChange={(value) => onStyle({ warnColor: value, preset: 'custom' })} />
        <SliderRow label="High use from" value={style.warnAt} min={0} max={100} suffix="%" onChange={(value) => onStyle({ warnAt: value })} />
        <SliderRow label="Chart height" value={layout.graphHeight} min={12} max={60} suffix="px" onChange={(value) => onLayout({ graphHeight: value })} />
        <SliderRow label="Bar thickness" value={layout.barHeight} min={2} max={14} suffix="px" onChange={(value) => onLayout({ barHeight: value })} />
        <SliderRow label="Chart width" value={layout.barWidth} min={70} max={240} suffix="px" onChange={(value) => onLayout({ barWidth: value })} />
      </section>

      <section className="space-y-4 border-t border-border pt-5">
        <h3 className="font-heading text-xs font-semibold uppercase tracking-wide text-muted-foreground">Text</h3>
        <ColorRow label="Values" value={style.textColor} onChange={(value) => onStyle({ textColor: value, preset: 'custom' })} />
        <ColorRow label="Labels" value={style.labelColor} onChange={(value) => onStyle({ labelColor: value, preset: 'custom' })} />
        <ColorRow label="Accent" value={style.accentColor} onChange={(value) => onStyle({ accentColor: value, preset: 'custom' })} />
        <SelectRow label="Font" value={style.font} onChange={(value) => onStyle({ font: value, preset: 'custom' })} options={FONT_OPTIONS} />
        <SliderRow label="Size" value={style.fontSize} min={10} max={22} suffix="px" onChange={(value) => onStyle({ fontSize: value })} />
        <SelectRow label="Weight" value={String(style.weight)} onChange={(value) => onStyle({ weight: Number(value) })} options={WEIGHT_OPTIONS} />
      </section>

      <section className="space-y-4 border-t border-border pt-5">
        <h3 className="font-heading text-xs font-semibold uppercase tracking-wide text-muted-foreground">Border and glow</h3>
        <SliderRow label="Border width" value={style.borderWidth} min={0} max={4} suffix="px" onChange={(value) => onStyle({ borderWidth: value })} />
        {style.borderWidth > 0 && (
          <ColorRow label="Border" value={style.borderColor} onChange={(value) => onStyle({ borderColor: value })} />
        )}
        <SwitchRow label="Glow" hint="Soft accent halo around the panel" checked={style.glow} onChange={(checked) => onStyle({ glow: checked })} />
      </section>
    </div>
  );
}