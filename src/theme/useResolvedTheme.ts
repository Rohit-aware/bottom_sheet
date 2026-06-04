import { useBottomSheetTheme } from './ThemeContext';
import type { BottomSheetTheme } from './types';

export const useResolvedTheme = (
  propsTheme?: Partial<BottomSheetTheme>,
): BottomSheetTheme => {
  const contextTheme = useBottomSheetTheme();

  return {
    ...contextTheme,
    ...propsTheme,
    colors: {
      ...contextTheme.colors,
      ...propsTheme?.colors,
    },
    radius: {
      ...contextTheme.radius,
      ...propsTheme?.radius,
    },
    spacing: {
      ...contextTheme.spacing,
      ...propsTheme?.spacing,
    },
    sizing: {
      ...contextTheme.sizing,
      ...propsTheme?.sizing,
    },
  };
};
