import configAppTemplate from '@/lib/templates/configure.sh.txt?raw';
import widgetEngineTemplate from '@/lib/templates/widget.lua.txt?raw';
import { metricChart } from '@/lib/widgetCatalog';

const READING_ORDER = [
  'cpu', 'cores', 'ram', 'swap', 'gpu', 'gputemp', 'temp', 'fan', 'freq',
  'disk', 'diski', 'net', 'wifi', 'load', 'top', 'topmem', 'running',
  'processes', 'battery', 'uptime', 'transfer', 'kernel', 'clock',
];

const noHash = (hex) => (hex || '#ffffff').replace('#', '').toUpperCase();

function weightName(weight) {
  if (Number(weight) >= 700) return 'bold';
  if (Number(weight) >= 600) return 'demibold';
  if (Number(weight) >= 500) return 'medium';
  return 'normal';
}

// Settings files are read by the desktop settings app, which splits values on
// commas and equals signs, so neither may appear inside a value.
function clean(text) {
  return String(text == null ? '' : text)
    .replace(/[\r\n]+/g, ' ')
    .replace(/\]\]/g, '] ]')
    .replace(/[\\'",&=]/g, '')
    .trim();
}

const quoted = (value) => "'" + clean(value) + "'";

export function designSlug(design) {
  const slug = clean(design?.name || 'widget')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 40);
  return slug || 'widget';
}

function shellName(name) {
  const safe = clean(name || 'Widget').replace(/[`$"]/g, '');
  return safe || 'Widget';
}

export function buildConkyConf(design) {
  const slug = designSlug(design);
  const { style, placement } = design;

  return [
    '# ' + clean(design.name || 'Widget') + ' -- generated with PlasmaRice Planner',
    '# Save as ~/.config/conky/' + slug + '/' + slug + '.conf',
    '# The look lives in settings.lua next to this file: use configure.sh to change it.',
    '',
    'conky.config = {',
    "    alignment = '" + placement.corner + "',",
    '    gap_x = ' + placement.gapX + ',',
    '    gap_y = ' + placement.gapY + ',',
    '    update_interval = ' + placement.updateInterval + ',',
    '    double_buffer = true,',
    '    use_xft = true,',
    "    font = '" + clean(style.font) + ':size=' + style.fontSize + ':weight=' + weightName(style.weight) + "',",
    "    default_color = '#" + noHash(style.textColor) + "',",
    "    color1 = '#" + noHash(style.labelColor) + "',",
    "    color2 = '#" + noHash(style.warnColor) + "',",
    "    color3 = '#" + noHash(style.accentColor) + "',",
    '    own_window = true,',
    "    own_window_type = 'normal',",
    "    own_window_hints = 'undecorated,below,sticky,skip_taskbar,skip_pager',",
    '    own_window_transparent = true,',
    '    own_window_argb_visual = true,',
    '    own_window_argb_value = 255,',
    '    border_inner_margin = ' + style.padding + ',',
    '    border_outer_margin = 0,',
    '    text_buffer_size = 8192,',
    '    cpu_avg_samples = 2,',
    '    net_avg_samples = 2,',
    "    lua_load = os.getenv('HOME') .. '/.config/conky/" + slug + "/widget.lua',",
    "    lua_draw_hook_pre = 'draw_panel',",
    '}',
    '',
    'conky.text = [[${lua_parse widget_rows}]]',
    '',
  ].join('\n');
}

export function buildSettingsLua(design) {
  const { layout, placement, style } = design;

  const rows = READING_ORDER.map((id) => {
    const metric = design.metrics.find((m) => m.id === id) || { id };
    return (
      '    ' +
      id +
      ' = { on = ' +
      (metric.enabled ? 'true' : 'false') +
      ', label = ' +
      quoted(metric.label) +
      ', target = ' +
      quoted(metric.target) +
      ', count = ' +
      (Number(metric.count) || 0) +
      ', format = ' +
      quoted(metric.format) +
      ", chart = '" +
      metricChart(metric) +
      "' },"
    );
  });

  return [
    '-- ' + clean(design.name || 'Widget') + ' -- settings for the desktop widget.',
    '-- Change these by hand, or with the settings app: configure.sh',
    'return {',
    '  name = ' + quoted(design.name || 'Widget') + ',',
    '  corner = ' + quoted(placement.corner) + ',',
    '  gap_x = ' + placement.gapX + ',',
    '  gap_y = ' + placement.gapY + ',',
    '  update_interval = ' + placement.updateInterval + ',',
    '  font = ' + quoted(style.font) + ',',
    '  font_size = ' + style.fontSize + ',',
    '  weight = ' + style.weight + ',',
    '  accent = ' + quoted(noHash(style.accentColor)) + ',',
    '  text = ' + quoted(noHash(style.textColor)) + ',',
    '  label = ' + quoted(noHash(style.labelColor)) + ',',
    '  bar = ' + quoted(noHash(style.barColor)) + ',',
    '  warn = ' + quoted(noHash(style.warnColor)) + ',',
    '  warn_at = ' + style.warnAt + ',',
    '  bg = ' + quoted(noHash(style.bgColor)) + ',',
    '  bg_opacity = ' + style.bgOpacity + ',',
    '  bg_blur = ' + style.bgBlur + ',',
    '  bg_image = ' + quoted(style.bgImage) + ',',
    '  radius = ' + style.radius + ',',
    '  padding = ' + style.padding + ',',
    '  border_width = ' + style.borderWidth + ',',
    '  border_color = ' + quoted(noHash(style.borderColor)) + ',',
    '  glow = ' + (style.glow ? 'true' : 'false') + ',',
    '  label_mode = ' + quoted(layout.labelMode) + ',',
    '  uppercase = ' + (layout.uppercase ? 'true' : 'false') + ',',
    '  separator = ' + (layout.separator ? 'true' : 'false') + ',',
    '  chart_height = ' + layout.graphHeight + ',',
    '  bar_height = ' + layout.barHeight + ',',
    '  bar_width = ' + layout.barWidth + ',',
    '  readings = {',
    ...rows,
    '  },',
    '}',
    '',
  ].join('\n');
}

export function buildWidgetLua(design) {
  return widgetEngineTemplate.replace(/__SLUG__/g, designSlug(design));
}

export function buildConfigApp(design) {
  return configAppTemplate.replace(/__SLUG__/g, designSlug(design)).replace(/__NAME__/g, shellName(design.name));
}

export function buildAutostart(design) {
  const slug = designSlug(design);
  return [
    '[Desktop Entry]',
    'Type=Application',
    'Name=' + clean(design.name || 'Widget'),
    'Comment=Desktop system monitor',
    'Exec=sh -c "conky -c $HOME/.config/conky/' + slug + '/' + slug + '.conf"',
    'Icon=utilities-system-monitor',
    'Terminal=false',
    'X-GNOME-Autostart-enabled=true',
    '',
  ].join('\n');
}

export function buildLauncher(design) {
  const slug = designSlug(design);
  return [
    '[Desktop Entry]',
    'Type=Application',
    'Name=' + clean(design.name || 'Widget') + ' settings',
    'Comment=Change the readings, colours and background of the panel',
    'Exec=bash $HOME/.config/conky/' + slug + '/configure.sh',
    'Icon=preferences-system',
    'Terminal=false',
    'Categories=Settings;DesktopSettings;',
    '',
  ].join('\n');
}