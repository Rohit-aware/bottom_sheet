import type { BottomSheetTheme } from './types';

export const defaultTheme: BottomSheetTheme = {
  colors: {
    background: '#FFFFFF',
    backdrop: 'rgba(26, 27, 37, 0.5)',
    handle: '#919191',
  },
  radius: {
    container: 32,
    handle: 4,
  },
  spacing: {
    handleMarginVertical: 8,
  },
  sizing: {
    handleWidth: 32,
    handleHeight: 4,
  },
};

export const darkTheme: BottomSheetTheme = {
  colors: {
    background: '#1A1B25',
    backdrop: 'rgba(0, 0, 0, 0.75)',
    handle: '#555555',
  },
  radius: {
    container: 32,
    handle: 4,
  },
  spacing: {
    handleMarginVertical: 8,
  },
  sizing: {
    handleWidth: 32,
    handleHeight: 4,
  },
};
