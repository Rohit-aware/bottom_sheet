import type { SharedValue } from 'react-native-reanimated';

export interface BottomSheetContextValue {
  close: (callback?: () => void) => void;
  currentSnapIndex: SharedValue<number>;
  topSnapIndex: SharedValue<number>;
}
