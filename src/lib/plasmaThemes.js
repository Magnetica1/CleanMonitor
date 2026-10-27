export const PLASMA_THEMES = [
  {
    id: 'breeze',
    label: 'Breeze',
    style: {
      bgColor: '#eff0f1',
      bgOpacity: 93,
      accentColor: '#3daee9',
      barColor: '#3daee9',
      warnColor: '#da4453',
      textColor: '#232629',
      labelColor: '#7a7c7d',
      font: 'Noto Sans',
    },
  },
  {
    id: 'breeze-dark',
    label: 'Breeze Dark',
    style: {
      bgColor: '#232629',
      bgOpacity: 88,
      accentColor: '#3daee9',
      barColor: '#3daee9',
      warnColor: '#da4453',
      textColor: '#eff0f1',
      labelColor: '#9da3a7',
      font: 'Noto Sans',
    },
  },
  {
    id: 'yaru',
    label: 'Yaru (Kubuntu)',
    style: {
      bgColor: '#2c001e',
      bgOpacity: 88,
      accentColor: '#e95420',
      barColor: '#e95420',
      warnColor: '#f6c343',
      textColor: '#f7f7f7',
      labelColor: '#c0a6b3',
      font: 'Ubuntu',
    },
  },
  {
    id: 'catppuccin',
    label: 'Catppuccin',
    style: {
      bgColor: '#1e1e2e',
      bgOpacity: 86,
      accentColor: '#89b4fa',
      barColor: '#89b4fa',
      warnColor: '#f38ba8',
      textColor: '#cdd6f4',
      labelColor: '#a6adc8',
      font: 'JetBrains Mono',
    },
  },
];

export function plasmaTheme(id) {
  return PLASMA_THEMES.find((theme) => theme.id === id);
}