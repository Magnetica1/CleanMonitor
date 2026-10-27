import { useState } from 'react';
import { Check, Copy, Download } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  buildAutostart,
  buildConfigApp,
  buildConkyConf,
  buildLauncher,
  buildSettingsLua,
  buildWidgetLua,
  designSlug,
} from '@/lib/conkyExport';

function download(filename, text) {
  const blob = new Blob([text], { type: 'text/plain;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  link.remove();
  URL.revokeObjectURL(url);
}

function CodeBlock({ filename, text, hint }) {
  const [copied, setCopied] = useState(false);

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 1800);
    } catch {
      setCopied(false);
    }
  };

  return (
    <div className="space-y-2">
      <div className="flex items-center gap-2">
        <p className="mr-auto font-mono text-[11px] text-muted-foreground">{filename}</p>
        <Button variant="outline" size="sm" onClick={copy}>
          {copied ? <Check className="mr-1.5 h-3.5 w-3.5" /> : <Copy className="mr-1.5 h-3.5 w-3.5" />}
          {copied ? 'Copied' : 'Copy'}
        </Button>
        <Button variant="outline" size="sm" onClick={() => download(filename, text)}>
          <Download className="mr-1.5 h-3.5 w-3.5" />
          Download
        </Button>
      </div>
      <pre className="max-h-[320px] overflow-auto rounded-xl border border-border bg-muted/50 p-3 font-mono text-[11px] leading-relaxed">
        {text}
      </pre>
      {hint && <p className="text-[11px] leading-snug text-muted-foreground">{hint}</p>}
    </div>
  );
}

export default function ExportDialog({ design, open, onOpenChange }) {
  const slug = designSlug(design);
  const folder = '~/.config/conky/' + slug;
  const enabled = design.metrics.filter((metric) => metric.enabled).length;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[90vh] max-w-3xl overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="font-heading">Export “{design.name || 'widget'}”</DialogTitle>
          <DialogDescription>
            {enabled} reading{enabled === 1 ? '' : 's'} · placed {design.placement.corner.replace('_', ' ')} · refreshes every{' '}
            {design.placement.updateInterval}s · tuned with the settings app on your desktop
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-3 rounded-xl border border-border bg-muted/40 p-4">
          <p className="font-heading text-xs font-semibold uppercase tracking-wide text-muted-foreground">On your Kubuntu machine</p>
          <ol className="space-y-2 text-sm">
            <li>
              <span className="text-muted-foreground">1. Install Conky and kdialog:</span>{' '}
              <code className="rounded bg-card px-1.5 py-0.5 font-mono text-xs">sudo apt install conky-all kdialog</code>
            </li>
            <li>
              <span className="text-muted-foreground">2. Make the folder:</span>{' '}
              <code className="rounded bg-card px-1.5 py-0.5 font-mono text-xs">mkdir -p {folder}</code>
            </li>
            <li>
              <span className="text-muted-foreground">3. Save all five files below into that folder.</span>
            </li>
            <li>
              <span className="text-muted-foreground">4. Start it:</span>{' '}
              <code className="rounded bg-card px-1.5 py-0.5 font-mono text-xs">conky -c {folder}/{slug}.conf</code>
            </li>
            <li>
              <span className="text-muted-foreground">5. Tune it whenever you like:</span>{' '}
              <code className="rounded bg-card px-1.5 py-0.5 font-mono text-xs">bash {folder}/configure.sh</code>{' '}
              <span className="text-muted-foreground">
                — readings, charts, colours, background and position, applied on the spot.
              </span>
            </li>
            <li>
              <span className="text-muted-foreground">6. Keep it after a restart:</span> save the autostart file to{' '}
              <code className="rounded bg-card px-1.5 py-0.5 font-mono text-xs">~/.config/autostart/</code>
            </li>
          </ol>
        </div>

        {design.style.bgImage && (
          <div className="space-y-2 rounded-xl border border-border bg-muted/40 p-4 text-[11px] leading-relaxed">
            <p className="font-heading text-xs font-semibold uppercase tracking-wide text-muted-foreground">Background image</p>
            <p className="text-muted-foreground">
              Save this picture on your desktop as a <span className="font-medium text-foreground">PNG</span> (Conky reads PNG backgrounds), then pick
              it in the settings app under Background → Image. The Blur and Solidity sliders sit the panel colour over it.
            </p>
            <a
              className="inline-flex items-center gap-1.5 font-medium text-foreground underline underline-offset-4"
              href={design.style.bgImage}
              target="_blank"
              rel="noreferrer"
            >
              <Download className="h-3 w-3" />
              Open the image to save it
            </a>
          </div>
        )}

        <Tabs defaultValue="conf">
          <TabsList className="grid w-full grid-cols-5">
            <TabsTrigger value="conf" className="text-[11px]">
              {slug}.conf
            </TabsTrigger>
            <TabsTrigger value="widget" className="text-[11px]">
              widget.lua
            </TabsTrigger>
            <TabsTrigger value="settings" className="text-[11px]">
              settings.lua
            </TabsTrigger>
            <TabsTrigger value="app" className="text-[11px]">
              configure.sh
            </TabsTrigger>
            <TabsTrigger value="launcher" className="text-[11px]">
              launcher
            </TabsTrigger>
          </TabsList>

          <TabsContent value="conf" className="mt-4">
            <CodeBlock
              filename={folder + '/' + slug + '.conf'}
              text={buildConkyConf(design)}
              hint="Conky reads this file: position, refresh rate, font and the text colours. The engine draws everything else."
            />
          </TabsContent>

          <TabsContent value="widget" className="mt-4">
            <CodeBlock
              filename={folder + '/widget.lua'}
              text={buildWidgetLua(design)}
              hint="The panel engine: it lays out the readings, draws the panel, the bars and the charts, and reads settings.lua on every refresh. Needs the conky-all package."
            />
          </TabsContent>

          <TabsContent value="settings" className="mt-4">
            <CodeBlock
              filename={folder + '/settings.lua'}
              text={buildSettingsLua(design)}
              hint="Your design as settings. The settings app writes this file, so you can also edit it by hand and the panel follows."
            />
          </TabsContent>

          <TabsContent value="app" className="mt-4">
            <CodeBlock
              filename={folder + '/configure.sh'}
              text={buildConfigApp(design)}
              hint="Run it with: bash configure.sh — or make it executable (chmod +x configure.sh) and use the launcher below."
            />
          </TabsContent>

          <TabsContent value="launcher" className="mt-4 space-y-4">
            <CodeBlock
              filename={slug + '-settings.desktop  →  ~/.local/share/applications/' + slug + '-settings.desktop'}
              text={buildLauncher(design)}
              hint="Puts the settings app in your application menu, so the panel can be changed without a terminal."
            />
            <CodeBlock
              filename={slug + '.desktop  →  ~/.config/autostart/' + slug + '.desktop'}
              text={buildAutostart(design)}
              hint="Starts the panel with your desktop. You can also add it through System Settings → Autostart."
            />
          </TabsContent>
        </Tabs>

        <div className="space-y-1.5 rounded-xl border border-border bg-muted/40 p-4 text-[11px] leading-relaxed text-muted-foreground">
          <p>
            <span className="font-medium text-foreground">Sensor reading:</span> the temperature line assumes hwmon sensor 0. Run{' '}
            <code className="rounded bg-card px-1 py-0.5 font-mono">sensors</code> and change the sensor number in the settings app if it stays blank.
          </p>
          <p>
            <span className="font-medium text-foreground">Wayland sessions:</span> Conky runs through XWayland. If the panel will not stay pinned or
            shows a black box, log in to an X11 session, or turn Solidity down to 0 and keep the border off.
          </p>
        </div>
      </DialogContent>
    </Dialog>
  );
}