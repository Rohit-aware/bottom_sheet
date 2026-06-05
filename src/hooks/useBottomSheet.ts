import { useContext } from 'react';
import type { SharedValue } from 'react-native-reanimated';
import { BottomSheetContext } from '../context/BottomSheetContext';
import { isTestEnvironment } from '../utils/environment';
import type { BottomSheetContextValue } from '../types/internal';

export const useBottomSheet = (): BottomSheetContextValue => {
  const contextValue = useContext(BottomSheetContext);

  if (contextValue === null && !isTestEnvironment()) {
    throw new Error(
      'useBottomSheet must be used within a BottomSheet component (or BottomSheetProvider).'
    );
  }

  
  return (
    contextValue || {
      close: () => {},
      currentSnapIndex: { value: 0 } as SharedValue<number>,
      topSnapIndex: { value: 0 } as SharedValue<number>,
    }
  );
};
