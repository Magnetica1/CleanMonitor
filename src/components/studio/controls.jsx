import { useEffect, useState } from 'react';
import { cn } from '@/lib/utils';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Slider } from '@/components/ui/slider';
import { Switch } from '@/components/ui/switch';

export function Field({ label, hint, children }) {
  return (
    <div className="space-y-1.5">
      {label && <Label className="text-xs font-medium text-muted-foreground">{label}</Label>}
      {children}
      {hint && <p className="text-[11px] leading-snug text-muted-foreground/80">{hint}</p>}
    </div>
  );
}

export function SliderRow({ label, value, min, max, step = 1, suffix = '', onChange }) {
  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <span className="text-xs font-medium text-muted-foreground">{label}</span>
        <span className="font-mono text-xs tabular-nums">
          {value}
          {suffix}
        </span>
      </div>
      <Slider value={[value]} min={min} max={max} step={step} onValueChange={([next]) => onChange(next)} />
    </div>
  );
}

export function ColorRow({ label, value, onChange }) {
  const [draft, setDraft] = useState(value);

  useEffect(() => {
    setDraft(value);
  }, [value]);

  const valid = /^#[0-9a-fA-F]{6}$/.test(draft);

  const commit = (next) => {
    setDraft(next);
    if (/^#[0-9a-fA-F]{6}$/.test(next)) onChange(next);
  };

  return (
    <div className="flex items-center justify-between gap-3">
      <span className="text-xs font-medium text-muted-foreground">{label}</span>
      <div className="flex items-center gap-2">
        <input
          type="text"
          value={draft}
          spellCheck={false}
          onChange={(e) => commit(e.target.value)}
          className="h-7 w-[88px] rounded-md border border-input bg-card px-2 font-mono text-[11px] uppercase"
        />
        <input
          type="color"
          value={valid ? draft : value}
          onChange={(e) => commit(e.target.value)}
          className="h-7 w-8 cursor-pointer rounded-md border border-input bg-card p-0.5"
        />
      </div>
    </div>
  );
}

export function SelectRow({ label, value, onChange, options }) {
  return (
    <div className="flex items-center justify-between gap-3">
      <span className="shrink-0 text-xs font-medium text-muted-foreground">{label}</span>
      <Select value={value} onValueChange={onChange}>
        <SelectTrigger className="h-8 w-[160px] text-xs">
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          {options.map((option) => (
            <SelectItem key={option.value} value={option.value} className="text-xs">
              {option.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}

export function SwitchRow({ label, hint, checked, onChange }) {
  return (
    <div className="flex items-start justify-between gap-4">
      <div className="space-y-0.5">
        <p className="text-xs font-medium">{label}</p>
        {hint && <p className="text-[11px] leading-snug text-muted-foreground">{hint}</p>}
      </div>
      <Switch checked={checked} onCheckedChange={onChange} className="mt-0.5 shrink-0" />
    </div>
  );
}

export function SegmentRow({ label, value, onChange, options }) {
  return (
    <div className="space-y-1.5">
      <span className="text-xs font-medium text-muted-foreground">{label}</span>
      <div className="flex gap-1 rounded-lg border border-border bg-muted/60 p-0.5">
        {options.map((option) => (
          <button
            key={option.value}
            type="button"
            onClick={() => onChange(option.value)}
            className={cn(
              'flex-1 rounded-md px-2 py-1.5 text-xs font-medium transition-all',
              value === option.value ? 'bg-card text-foreground shadow-sm' : 'text-muted-foreground hover:text-foreground',
            )}
          >
            {option.label}
          </button>
        ))}
      </div>
    </div>
  );
}