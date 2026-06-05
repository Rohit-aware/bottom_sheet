import type { ReactNode } from 'react';
import type { ViewStyle } from 'react-native';
import type { SharedValue } from 'react-native-reanimated';
import type { BottomSheetTheme } from '../theme/types';

export type SnapPoint = number | `${number}%`;

export interface BottomSheetRenderProps {
  close: (callback?: () => void) => void;
  snapToIndex: (index: number) => void;
  expand: () => void;
  collapse: () => void;
  currentSnapIndex: SharedValue<number>;
}

export interface BottomSheetStyleOverrides {
  container?: ViewStyle;
  handle?: ViewStyle;
  contentContainer?: ViewStyle;
  backdrop?: ViewStyle;
  overlay?: ViewStyle;
}

export interface BottomSheetAnimationConfig {
  duration?: number;
  openEasing?: (value: number) => number;
  closeEasing?: (value: number) => number;
  snapEasing?: (value: number) => number;
}

export interface BottomSheetProps {
  
  snapPoints: SnapPoint[];
  
  onClose: () => void;
  
  visible: boolean;
  
  initialSnapIndex?: number;
  
  enableDynamicSizing?: boolean;
  
  lazy?: boolean;
  
  enableDragToClose?: boolean;
  
  enableBackdropDismiss?: boolean;
  
  portal?: boolean;
  
  theme?: Partial<BottomSheetTheme>;
  
  style?: BottomSheetStyleOverrides;
  
  accessibilityProps?: {
    accessibilityViewIsModal?: boolean;
    importantForAccessibility?: 'auto' | 'yes' | 'no' | 'no-hide-descendants';
  };
  
  animationConfig?: BottomSheetAnimationConfig;
  
  onSnap?: (index: number) => void;
  
  renderHandle?: (props: { theme: BottomSheetTheme }) => ReactNode;
  
  renderBackdrop?: (props: {
    onPress: () => void;
    animatedStyle: object;
  }) => ReactNode;
  
  children?: ReactNode | ((props: BottomSheetRenderProps) => ReactNode);
  
  avoidKeyboard?: boolean;
}
