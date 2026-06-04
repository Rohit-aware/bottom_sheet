import { createContext } from 'react';
import type { BottomSheetContextValue } from '../types/internal';

/**
 * Shared context for communication between the bottom sheet parent and its children.
 */
export const BottomSheetContext = createContext<BottomSheetContextValue | null>(null);

export const BottomSheetProvider = BottomSheetContext.Provider;
