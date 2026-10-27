# PlasmaRice Planner

A design studio for KDE Plasma system monitors. Lay out a Conky widget in the browser, style it to
match your desktop, then export a small package that runs on your machine and can be tuned from a
native settings window afterwards.

The widget it builds:

- readings: CPU, per-core CPU, memory, swap, GPU usage, GPU temperature, CPU/GPU temperature, fan
  speed, CPU frequency, disk space, disk activity, network up/down, Wi-Fi signal, load average,
  top processes by CPU, top processes by memory, running processes, process count, battery, uptime,
  total data transferred, kernel and a clock
- charts: none, bar, line graph, gauge, pie or donut per reading
- style: eight presets, custom colours, a separate high-use colour with its own threshold, fonts,
  label position, dividers
- background: colour, solidity, blur, rounded corners, padding, border, glow, or your own image
- placement: any of the nine screen corners, gaps, refresh rate

## Using the studio

1. Open the app. The live preview sits on the left on a mock desktop, and the panel on the right holds
   the readings, layout and style controls.
2. Turn readings on or off and give each one a label, a target (mount point, interface, sensor), a
   chart type and, where it applies, how many rows to show.
3. Style it: pick a preset or set colours by hand, choose a font, drop in a background image, set the
   corner of the screen it should sit in.
4. Press **Export**. Save your designs by name first if you want to come back to them.

## What the export gives you

The export window lists every file with a copy button and a download button. Everything except the two
launchers goes into `~/.config/conky/<your-widget-name>/`:

| File | What it is |
| --- | --- |
| `<name>.conf` | The Conky configuration: position, font, and the hook that draws the panel. |
| `widget.lua` | The drawing engine. Reads a history of each reading and paints bars, lines, gauges and the panel background. |
| `settings.lua` | Every value the widget shows and how it looks. The widget re-reads this file on each refresh, so changes appear within seconds. |
| `configure.sh` | The settings app. A Kdialog window that edits `settings.lua` and the `.conf` for you. |
| `<name>-settings.desktop` | A launcher so the settings app appears in your application menu. |
| `<name>-autostart.desktop` | Put this in `~/.config/autostart/` to start the widget at login. |

## Installing it

```bash
sudo apt install conky-all kdialog
mkdir -p ~/.config/conky/my-widget        # the folder named after your widget
# save the .conf, widget.lua, settings.lua and configure.sh into that folder
conky -c ~/.config/conky/my-widget/my-widget.conf
```

Make it permanent: copy the autostart file to `~/.config/autostart/`, and the settings launcher to
`~/.local/share/applications/` if you want it in the menu.

## The settings app

Run `bash ~/.config/conky/<your-widget-name>/configure.sh`, or use the launcher. Every change is
written to disk and the widget is restarted for you.

- **Readings**: pick which readings show, set targets, labels and formats, and choose a chart per reading.
- **Colours**: accent, bars and graphs, a separate high-use colour, and the percentage it starts at.
- **Background**: colour, solidity, blur, an image, corner radius.
- **Text**: font, size, weight, capital letters, label position, divider lines.
- **Panel**: padding, chart height, bar thickness, chart width, border, glow.
- **Position**: screen corner, side and top/bottom gaps, refresh rate.
- **Match my Plasma theme**: reads your active Plasma colour scheme and font and applies them.

## Notes on the awkward readings

- **GPU usage / GPU temperature**: there is no single video card reading in Conky, so these two
  detect your card for you. AMD and Intel report through `/sys/class/drm/*/gpu_busy_percent` and the
  `amdgpu`, `radeon`, `xe` hwmon devices; NVIDIA answers through `nvidia-smi` or Conky's own
  `${nvidia ...}` variables. If detection picks the wrong card, set the target in the settings app to
  `nvidia`, or to a hwmon device such as `amdgpu`, `radeon`, `xe`, or a number. Readings are sampled
  every two seconds, so a card that is asleep may briefly report nothing.
- **Fan speed / CPU temperature**: these read a hwmon device. Run `sensors` (from `lm-sensors`) to see
  which device and sensor number your machine exposes, then set it in the settings app.
- **Wi-Fi signal**: set the interface (`iw dev` lists them), or leave the default `wlan0`.
- **Network chart**: the download line is filled underneath and drawn solid, the upload line is dashed,
  both scaled to the same peak. Download is the bigger number, so the upload line sits lower.
- **Data transferred and disk activity**: Conky reports these with their own units, so they are text
  readings rather than charts.
- **Background images**: the settings app expects a PNG (blur is skipped for very small images).

## Getting the code

```bash
git clone https://github.com/Magnetica1/CleanMonitor.git
cd CleanMonitor
```

The repository holds a snapshot of the studio's source. To run it on your own machine, follow the
steps in [Running the studio locally](#running-the-studio-locally) below. To keep a Base44 app and a
repository in two-way sync instead, use the **GitHub** icon in the Base44 dashboard: it needs the
Builder plan, and only the app owner can connect it.

## Running the studio locally

```bash
npm install
npm install -g base44@latest
base44 login     # once per machine
base44 link      # once per clone
base44 dev       # local backend and frontend together
```

Notes:

- Every fresh clone needs `base44 link`; it writes `base44/.app.jsonc`, which is gitignored.
- `base44 dev` starts the frontend for you. Do not run `npm run dev` beside it.
- The app must be published at least once for the local UI to load.
- Entity data is in-memory locally and is wiped when `base44 dev` restarts.

Docs: [local development](https://docs.base44.com/developers/backend/overview/local-dev/local-development-overview) ·
[GitHub integration](https://docs.base44.com/developers/app-code/local-development/github)

## Project layout

```
src/pages/Studio.jsx               the studio screen
src/components/studio/             preview, tabs, charts, export dialog
src/lib/widgetCatalog.js           the readings catalogue, presets and defaults
src/lib/conkyExport.js             builds the exported files
src/lib/metricDisplay.js           formats each reading for the preview
src/lib/templates/widget.lua.txt   the exported drawing engine
src/lib/templates/configure.sh.txt the exported settings app
src/hooks/useSimulatedMetrics.js   the sample numbers the preview animates
```

## Credits and licence

The studio is a plain React app built on the Base44 platform. The exported widget is plain Conky Lua
and Bash, so once exported it runs on any KDE desktop without this app installed. No licence is set
on this project yet: add one before you share it beyond your own machine.