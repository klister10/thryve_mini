import { MD3LightTheme } from 'react-native-paper';

export const colors = {
  background: '#FFF7EE',
  card: '#FFFFFF',
  text: '#2E2A26',
  textMuted: '#8C8377',
  coral: '#FF6F59',
  coralSoft: '#FFD9CE',
  track: '#E9E1D6',
  success: '#2FC69A',
  successSoft: '#CFF3E7',
  confetti: ['#FF6F59', '#2FC69A', '#FFC24B', '#7C9EFF', '#FF8FB1'],
};

export const paperTheme = {
  ...MD3LightTheme,
  colors: {
    ...MD3LightTheme.colors,
    primary: colors.coral,
    background: colors.background,
    surface: colors.card,
    onSurface: colors.text,
  },
};
