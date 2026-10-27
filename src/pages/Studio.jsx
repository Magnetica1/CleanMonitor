import { useEffect, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { Activity, Download, LayoutDashboard, LayoutGrid, Palette, RotateCcw, Save } from 'lucide-react';
import { base44 } from '@/api/base44Client';
import { Image } from '@/components/ui/image';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useToast } from '@/components/ui/use-toast';
import { cloneDesign, DEFAULT_DESIGN, mergeDesign } from '@/lib/widgetCatalog';
import ExportDialog from '@/components/studio/ExportDialog';
import useSimulatedMetrics from '@/hooks/useSimulatedMetrics';
import DesktopPreview from '@/components/studio/DesktopPreview';
import MetricsTab from '@/components/studio/MetricsTab';
import LayoutTab from '@/components/studio/LayoutTab';
import StyleTab from '@/components/studio/StyleTab';

const LOGO = 'https://media.base44.com/images/public/6adff391352994d3c44df63c/2e872217f_logo.png';

export default function Studio() {
  const { toast } = useToast();
  const [design, setDesign] = useState(() => cloneDesign(DEFAULT_DESIGN));
  const [savedId, setSavedId] = useState(null);
  const [saving, setSaving] = useState(false);
  const [exportOpen, setExportOpen] = useState(false);
  const values = useSimulatedMetrics();

  const [searchParams, setSearchParams] = useSearchParams();
  const designParam = searchParams.get('id');
  const [loadedId, setLoadedId] = useState(null);

  useEffect(() => {
    if (!designParam || loadedId === designParam) return;
    let active = true;
    base44.entities.WidgetDesign.get(designParam)
      .then((record) => {
        if (!active || !record) return;
        setLoadedId(designParam);
        setSavedId(record.id);
        setDesign({ ...mergeDesign(record.config), name: record.name || 'Untitled widget' });
      })
      .catch(() => {
        if (active) toast({ title: 'That widget could not be opened', variant: 'destructive' });
      });
    return () => {
      active = false;
    };
  }, [designParam, loadedId, toast]);

  const save = async () => {
    setSaving(true);
    try {
      const payload = {
        name: design.name.trim() || 'Untitled widget',
        config: design,
        readings: design.metrics.filter((metric) => metric.enabled).map((metric) => metric.id),
      };
      const record = savedId
        ? await base44.entities.WidgetDesign.update(savedId, payload)
        : await base44.entities.WidgetDesign.create(payload);
      setSavedId(record.id);
      setLoadedId(record.id);
      setSearchParams({ id: record.id }, { replace: true });
      toast({ title: 'Widget saved', description: 'Find it under My widgets.' });
    } catch (error) {
      toast({ title: 'Could not save', description: error?.message || 'Please try again.', variant: 'destructive' });
    } finally {
      setSaving(false);
    }
  };

  const patchSection = (section, patch) => setDesign((current) => ({ ...current, [section]: { ...current[section], ...patch } }));
  const patchMetric = (id, patch) =>
    setDesign((current) => ({ ...current, metrics: current.metrics.map((metric) => (metric.id === id ? { ...metric, ...patch } : metric)) }));
  const applyPreset = (preset) => patchSection('style', { ...preset.style, preset: preset.id });

  return (
    <div className="min-h-screen bg-background">
      <header className="sticky top-0 z-20 border-b border-border bg-background/85 backdrop-blur">
        <div className="mx-auto flex max-w-[1480px] items-center gap-3 px-4 py-3 sm:px-6">
          <Image src={LOGO} alt="PlasmaRice Planner" className="h-8 w-8 shrink-0" />
          <div className="mr-auto min-w-0">
            <p className="font-heading text-sm font-semibold leading-tight">PlasmaRice Planner</p>
            <p className="truncate text-xs text-muted-foreground">Widget studio for KDE Plasma</p>
          </div>
          <Button
            variant="ghost"
            size="sm"
            className="text-muted-foreground"
            onClick={() => {
              setDesign(cloneDesign(DEFAULT_DESIGN));
              setSavedId(null);
              setLoadedId(null);
              setSearchParams({}, { replace: true });
            }}
          >
            <RotateCcw className="mr-1.5 h-3.5 w-3.5" />
            <span className="hidden sm:inline">Reset</span>
          </Button>
          <Button variant="outline" size="sm" asChild>
            <Link to="/designs">
              <LayoutGrid className="sm:mr-1.5 h-3.5 w-3.5" />
              <span className="hidden sm:inline">My widgets</span>
            </Link>
          </Button>
          <Button variant="outline" size="sm" onClick={save} disabled={saving}>
            <Save className="sm:mr-1.5 h-3.5 w-3.5" />
            <span className="hidden sm:inline">{saving ? 'Saving…' : 'Save'}</span>
          </Button>
          <Button size="sm" onClick={() => setExportOpen(true)}>
            <Download className="sm:mr-1.5 h-3.5 w-3.5" />
            <span className="hidden sm:inline">Export</span>
          </Button>
        </div>
      </header>

      <main className="mx-auto grid max-w-[1480px] gap-6 px-4 py-6 sm:px-6 lg:grid-cols-[minmax(0,1fr)_400px] lg:gap-8">
        <section className="space-y-3">
          <DesktopPreview design={design} values={values} />
          <p className="text-xs leading-relaxed text-muted-foreground">
            The panel sits where you place it on your desktop. Readings in this preview are sample values, so you can judge the look before it runs on
            your machine.
          </p>
        </section>

        <aside className="space-y-4 lg:sticky lg:top-[78px] lg:max-h-[calc(100vh-100px)] lg:overflow-y-auto lg:pr-1">
          <Input
            value={design.name}
            onChange={(e) => setDesign((current) => ({ ...current, name: e.target.value }))}
            placeholder="Name this widget"
            className="h-10 font-heading text-sm font-medium"
          />

          <Tabs defaultValue="metrics">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="metrics" className="gap-1.5 text-xs">
                <Activity className="h-3.5 w-3.5" />
                Readings
              </TabsTrigger>
              <TabsTrigger value="layout" className="gap-1.5 text-xs">
                <LayoutDashboard className="h-3.5 w-3.5" />
                Layout
              </TabsTrigger>
              <TabsTrigger value="style" className="gap-1.5 text-xs">
                <Palette className="h-3.5 w-3.5" />
                Style
              </TabsTrigger>
            </TabsList>

            <TabsContent value="metrics" className="mt-4">
              <MetricsTab design={design} onMetric={patchMetric} />
            </TabsContent>

            <TabsContent value="layout" className="mt-4">
              <LayoutTab
                design={design}
                onLayout={(patch) => patchSection('layout', patch)}
                onPlacement={(patch) => patchSection('placement', patch)}
              />
            </TabsContent>

            <TabsContent value="style" className="mt-4">
              <StyleTab
                design={design}
                onStyle={(patch) => patchSection('style', patch)}
                onLayout={(patch) => patchSection('layout', patch)}
                onPreset={applyPreset}
              />
            </TabsContent>
          </Tabs>
        </aside>
      </main>

      <ExportDialog design={design} open={exportOpen} onOpenChange={setExportOpen} />
    </div>
  );
}