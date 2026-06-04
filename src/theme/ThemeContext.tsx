import React, { createContext, useContext, ReactNode } from 'react';
import { defaultTheme } from './defaultTheme';
import type { BottomSheetTheme } from './types';

const ThemeContext = createContext<BottomSheetTheme>(defaultTheme);

export interface BottomSheetThemeProviderProps {
  theme: BottomSheetTheme;
  children: ReactNode;
}

/**
 * Theme provider that supplies style tokens to nested bottom sheets.
 */
export const BottomSheetThemeProvider = ({
  theme,
  children,
}: BottomSheetThemeProviderProps) => {
  return (
    <ThemeContext.Provider value={theme}>
      {children}
    </ThemeContext.Provider>
  );
};

/**
 * Hook to retrieve the current BottomSheetTheme tokens from context.
 */
export const useBottomSheetTheme = (): BottomSheetTheme => {
  return useContext(ThemeContext);
};
