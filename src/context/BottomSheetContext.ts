import { createContext } from 'react';
import type { BottomSheetContextValue } from '../types/internal';

export const BottomSheetContext = createContext<BottomSheetContextValue | null>(null);

export const BottomSheetProvider = BottomSheetContext.Provider;
