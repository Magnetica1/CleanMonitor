import MetricRow from '@/components/studio/MetricRow';
import { Image } from '@/components/ui/image';
import { fontStack, hexToRgba, metricDef } from '@/lib/widgetCatalog';

export default function WidgetCard({ design, values }) {
  const { layout, style } = design;
  const enabled = design.metrics.filter((metric) => metric.enabled && metricDef(metric.id));
  const translucent = style.bgOpacity < 62;
  const tint = hexToRgba(style.bgColor, style.bgOpacity / 100);

  return (
    <div
      style={{
        position: 'relative',
        overflow: 'hidden',
        background: tint,
        border: style.borderWidth ? `${style.borderWidth}px solid ${hexToRgba(style.borderColor, 0.4)}` : '1px solid rgba(255, 255, 255, 0.07)',
        borderRadius: style.radius,
        padding: style.padding,
        color: style.textColor,
        fontFamily: fontStack(style.font),
        fontSize: style.fontSize,
        fontWeight: style.weight,
        maxWidth: 380,
        minWidth: layout.barWidth + style.padding * 2 + 10,
        boxShadow: style.glow
          ? `0 0 0 1px ${hexToRgba(style.accentColor, 0.25)}, 0 18px 50px -14px ${hexToRgba(style.accentColor, 0.55)}`
          : '0 22px 45px -26px rgba(0, 0, 0, 0.85)',
        backdropFilter: translucent ? 'blur(12px)' : undefined,
      }}
    >
      {style.bgImage && (
        <div
          className="pointer-events-none absolute inset-0"
          style={{ filter: style.bgBlur ? `blur(${style.bgBlur}px)` : undefined, transform: style.bgBlur ? 'scale(1.06)' : undefined }}
        >
          <Image src={style.bgImage} alt="" className="h-full w-full" fittingType="fill" />
        </div>
      )}
      {style.bgImage && <div className="pointer-events-none absolute inset-0" style={{ background: tint }} />}

      <div style={{ position: 'relative' }}>
        {enabled.length === 0 ? (
          <p style={{ color: style.labelColor, fontSize: Math.max(10, style.fontSize - 1) }}>Pick at least one reading</p>
        ) : (
          <div style={{ display: 'grid', gap: layout.gap }}>
            {enabled.map((metric, index) => (
              <div key={metric.id} style={{ display: 'grid', gap: 6 }}>
                {layout.separator && index > 0 && (
                  <div style={{ height: 1, background: hexToRgba(style.labelColor, 0.22), marginBottom: layout.gap - 6 }} />
                )}
                <MetricRow metric={metric} def={metricDef(metric.id)} values={values} layout={layout} style={style} />
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}