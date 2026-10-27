import { CORNERS } from '@/lib/widgetCatalog';
import { SegmentRow, SelectRow, SliderRow, SwitchRow } from '@/components/studio/controls';

const LABEL_MODES = [
  { value: 'left', label: 'Label left' },
  { value: 'above', label: 'Label above' },
  { value: 'inline', label: 'Inline' },
];

const CORNER_OPTIONS = CORNERS.map((corner) => ({ value: corner.id, label: corner.label }));

export default function LayoutTab({ design, onLayout, onPlacement }) {
  const { layout, placement } = design;

  return (
    <div className="space-y-5">
      <section className="space-y-4">
        <h3 className="font-heading text-xs font-semibold uppercase tracking-wide text-muted-foreground">Rows</h3>
        <SegmentRow label="Label position" value={layout.labelMode} onChange={(value) => onLayout({ labelMode: value })} options={LABEL_MODES} />
        <SliderRow label="Row spacing" value={layout.gap} min={2} max={26} suffix="px" onChange={(value) => onLayout({ gap: value })} />
        <SwitchRow label="Capitalise labels" checked={layout.uppercase} onChange={(checked) => onLayout({ uppercase: checked })} />
        <SwitchRow label="Divider lines" checked={layout.separator} onChange={(checked) => onLayout({ separator: checked })} />
      </section>

      <section className="space-y-4 border-t border-border pt-5">
        <h3 className="font-heading text-xs font-semibold uppercase tracking-wide text-muted-foreground">Placement</h3>
        <SelectRow label="Screen corner" value={placement.corner} onChange={(value) => onPlacement({ corner: value })} options={CORNER_OPTIONS} />
        <SliderRow label="Side gap" value={placement.gapX} min={0} max={240} suffix="px" onChange={(value) => onPlacement({ gapX: value })} />
        <SliderRow label="Top / bottom gap" value={placement.gapY} min={0} max={240} suffix="px" onChange={(value) => onPlacement({ gapY: value })} />
        <SliderRow
          label="Refresh every"
          value={placement.updateInterval}
          min={1}
          max={10}
          suffix="s"
          onChange={(value) => onPlacement({ updateInterval: value })}
        />
      </section>
    </div>
  );
}