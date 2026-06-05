import React, { createContext, useContext, ReactNode } from 'react';
import { defaultTheme } from './defaultTheme';
import type { BottomSheetTheme } from './types';

const ThemeContext = createContext<BottomSheetTheme>(defaultTheme);

export interface BottomSheetThemeProviderProps {
  theme: BottomSheetTheme;
  children: ReactNode;
}

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

export const useBottomSheetTheme = (): BottomSheetTheme => {
  return useContext(ThemeContext);
};
