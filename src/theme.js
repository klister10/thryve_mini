import { MD3LightTheme } from 'react-native-paper';

// Palette: coolors.co/034732-cedfd9-f5f5f5-f5b82e-d16014, applied the way the
// concept does it: warm cream canvas, amber hero card, burnt-orange sunburst,
// deep green for text and buttons.
// Contrast: deep green on cream ~10:1, white on deep green ~11:1,
// muted green on cream ~5:1, dark orange text on cream ~5.5:1.
export const colors = {
  background: '#FFF7E4',
  card: '#FFFFFF',
  text: '#034732',
  textMuted: '#4F6B60',

  primary: '#034732',
  onPrimary: '#FFFFFF',

  // Warm accents (incomplete state)
  amber: '#F5B82E',
  accent: '#D16014',
  accentText: '#A64A0A',
  accentSoft: '#FCEAC0',

  // Calm greens (surfaces and completed state)
  sage: '#CEDFD9',
  track: '#CEDFD9',
  success: '#0E7A58',
  successSoft: '#CEDFD9',

  confetti: ['#F5B82E', '#D16014', '#0E7A58', '#7FB8A4', '#034732'],
};

export const paperTheme = {
  ...MD3LightTheme,
  colors: {
    ...MD3LightTheme.colors,
    primary: colors.primary,
    onPrimary: colors.onPrimary,
    background: colors.background,
    surface: colors.card,
    onSurface: colors.text,
  },
};
