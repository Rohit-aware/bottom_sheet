export { BottomSheet } from './components/BottomSheet';
export { BottomSheetHandle } from './components/BottomSheetHandle';
export { BottomSheetBackdrop } from './components/BottomSheetBackdrop';

export { useBottomSheet } from './hooks/useBottomSheet';

export { BottomSheetThemeProvider, useBottomSheetTheme } from './theme/ThemeContext';
export { defaultTheme, darkTheme } from './theme/defaultTheme';

export type { BottomSheetTheme } from './theme/types';
export type {
  BottomSheetProps,
  BottomSheetRenderProps,
  SnapPoint,
  BottomSheetStyleOverrides,
  BottomSheetAnimationConfig,
} from './types/props';
export type { BottomSheetRef } from './types/ref';
