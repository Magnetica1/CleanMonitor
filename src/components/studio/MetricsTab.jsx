import { cn } from '@/lib/utils';
import { chartOptions, METRICS, metricChart } from '@/lib/widgetCatalog';
import { Field, SelectRow } from '@/components/studio/controls';
import { Input } from '@/components/ui/input';
import { Switch } from '@/components/ui/switch';

export default function MetricsTab({ design, onMetric }) {
  return (
    <div className="space-y-2">
      {METRICS.map((def) => {
        const metric = design.metrics.find((m) => m.id === def.id);
        if (!metric) return null;

        return (
          <div
            key={def.id}
            className={cn(
              'rounded-xl border p-3 transition-colors',
              metric.enabled ? 'border-border bg-card shadow-sm' : 'border-transparent bg-muted/50',
            )}
          >
            <div className="flex items-start gap-3">
              <Switch checked={metric.enabled} onCheckedChange={(checked) => onMetric(def.id, { enabled: checked })} />
              <div className="mr-auto min-w-0">
                <p className="text-sm font-medium leading-tight">{def.label}</p>
                <p className="text-[11px] leading-snug text-muted-foreground">{def.hint}</p>
              </div>
            </div>

            {metric.enabled && (
              <div className="mt-3 space-y-2 border-t border-border pt-3">
                <Field label="Label">
                  <Input
                    value={metric.label}
                    placeholder={def.label}
                    onChange={(e) => onMetric(def.id, { label: e.target.value })}
                    className="h-8 text-sm"
                  />
                </Field>

                {chartOptions(metric).length > 1 && (
                  <SelectRow
                    label="Chart"
                    value={metricChart(metric)}
                    onChange={(value) => onMetric(def.id, { chart: value })}
                    options={chartOptions(metric)}
                  />
                )}

                {def.target && (
                  <Field label={def.target.label} hint={def.target.hint}>
                    <Input
                      value={metric.target}
                      placeholder={def.target.def || 'all'}
                      onChange={(e) => onMetric(def.id, { target: e.target.value })}
                      className="h-8 font-mono text-xs"
                    />
                  </Field>
                )}

                {def.count && (
                  <Field label="How many to show">
                    <Input
                      type="number"
                      min={1}
                      max={def.count.max}
                      value={metric.count}
                      onChange={(e) => {
                        const parsed = parseInt(e.target.value, 10);
                        const safe = Number.isNaN(parsed) ? 1 : Math.min(def.count.max, Math.max(1, parsed));
                        onMetric(def.id, { count: safe });
                      }}
                      className="h-8 text-xs"
                    />
                  </Field>
                )}

                {def.format && (
                  <Field label={def.format.label} hint="Uses the usual time codes, e.g. %H:%M:%S">
                    <Input
                      value={metric.format}
                      onChange={(e) => onMetric(def.id, { format: e.target.value })}
                      className="h-8 font-mono text-xs"
                    />
                  </Field>
                )}
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}