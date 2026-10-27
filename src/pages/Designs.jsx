import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, Plus } from 'lucide-react';
import { base44 } from '@/api/base44Client';
import { Image } from '@/components/ui/image';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { useToast } from '@/components/ui/use-toast';
import useSimulatedMetrics from '@/hooks/useSimulatedMetrics';
import DesignCard from '@/components/designs/DesignCard';

const LOGO = 'https://media.base44.com/images/public/6adff391352994d3c44df63c/2e872217f_logo.png';

export default function Designs() {
  const { toast } = useToast();
  const [records, setRecords] = useState(null);
  const values = useSimulatedMetrics();

  const load = async () => {
    const page = await base44.entities.WidgetDesign.list({ sort: '-updated_date', limit: 60 });
    setRecords(page.items);
  };

  useEffect(() => {
    load();
  }, []);

  const duplicate = async (record) => {
    try {
      await base44.entities.WidgetDesign.create({
        name: record.name + ' copy',
        config: record.config,
        readings: record.readings || [],
      });
      toast({ title: 'Widget duplicated' });
    } catch {
      toast({ title: 'That widget could not be duplicated', variant: 'destructive' });
    }
    await load();
  };

  const remove = async (record) => {
    try {
      await base44.entities.WidgetDesign.delete(record.id);
      toast({ title: 'Widget deleted' });
    } catch {
      toast({ title: 'That widget was already gone', variant: 'destructive' });
    }
    await load();
  };

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b border-border">
        <div className="mx-auto flex max-w-[1480px] items-center gap-3 px-4 py-3 sm:px-6">
          <Image src={LOGO} alt="PlasmaRice Planner" className="h-8 w-8 shrink-0" />
          <div className="mr-auto">
            <p className="font-heading text-sm font-semibold leading-tight">PlasmaRice Planner</p>
            <p className="text-xs text-muted-foreground">My widgets</p>
          </div>
          <Button variant="outline" size="sm" asChild>
            <Link to="/">
              <ArrowLeft className="mr-1.5 h-3.5 w-3.5" />
              Studio
            </Link>
          </Button>
          <Button size="sm" asChild>
            <Link to="/">
              <Plus className="mr-1.5 h-3.5 w-3.5" />
              New widget
            </Link>
          </Button>
        </div>
      </header>

      <main className="mx-auto max-w-[1480px] px-4 py-8 sm:px-6">
        {records === null ? (
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {[0, 1, 2].map((key) => (
              <Skeleton key={key} className="h-[280px] rounded-2xl" />
            ))}
          </div>
        ) : records.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-border px-6 py-16 text-center">
            <h1 className="font-heading text-xl font-semibold">Nothing saved yet</h1>
            <p className="mx-auto mt-2 max-w-md text-sm text-muted-foreground">
              Build a panel in the studio — pick your readings, style it, then export it for your Kubuntu desktop. Saved designs show up here.
            </p>
            <Button className="mt-6" asChild>
              <Link to="/">Open the studio</Link>
            </Button>
          </div>
        ) : (
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {records.map((record) => (
              <DesignCard key={record.id} record={record} values={values} onDuplicate={duplicate} onDelete={remove} />
            ))}
          </div>
        )}
      </main>
    </div>
  );
}