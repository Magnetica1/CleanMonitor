import { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import moment from 'moment';
import { Copy, Pencil, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import WidgetCard from '@/components/studio/WidgetCard';
import { mergeDesign } from '@/lib/widgetCatalog';

const WALLPAPER = 'linear-gradient(150deg, #101625 0%, #1c2338 55%, #0d1018 100%)';

export default function DesignCard({ record, values, onDuplicate, onDelete }) {
  const [confirmOpen, setConfirmOpen] = useState(false);
  const design = useMemo(() => ({ ...mergeDesign(record.config), name: record.name }), [record]);
  const readings = design.metrics.filter((metric) => metric.enabled).length;

  return (
    <div className="group overflow-hidden rounded-2xl border border-border bg-card shadow-sm transition-shadow hover:shadow-md">
      <div className="relative h-[168px] overflow-hidden" style={{ background: WALLPAPER }}>
        <div className="absolute left-4 top-4 origin-top-left" style={{ transform: 'scale(0.82)' }}>
          <WidgetCard design={design} values={values} />
        </div>
      </div>

      <div className="space-y-3 p-4">
        <div>
          <p className="font-heading text-sm font-semibold leading-tight">{record.name}</p>
          <p className="text-[11px] text-muted-foreground">
            {readings} reading{readings === 1 ? '' : 's'} · updated {moment(record.updated_date).fromNow()}
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Button size="sm" className="mr-auto" asChild>
            <Link to={'/?id=' + record.id}>
              <Pencil className="mr-1.5 h-3.5 w-3.5" />
              Open
            </Link>
          </Button>
          <Button variant="outline" size="sm" onClick={() => onDuplicate(record)} aria-label="Duplicate widget">
            <Copy className="h-3.5 w-3.5" />
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setConfirmOpen(true)}
            aria-label="Delete widget"
            className="text-muted-foreground hover:text-destructive"
          >
            <Trash2 className="h-3.5 w-3.5" />
          </Button>
        </div>
      </div>

      <AlertDialog open={confirmOpen} onOpenChange={setConfirmOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete “{record.name}”?</AlertDialogTitle>
            <AlertDialogDescription>This removes the saved design for good. The widget on your desktop is not affected.</AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Keep it</AlertDialogCancel>
            <AlertDialogAction onClick={() => onDelete(record)}>Delete</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}