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
  /**
   * Snap point heights. Accepts numbers (px) or strings representing percentages (e.g. '50%').
   */
  snapPoints: SnapPoint[];
  /**
   * Called when the bottom sheet is fully closed.
   */
  onClose: () => void;
  /**
   * Controls bottom sheet visibility.
   */
  visible: boolean;
  /**
   * Initial snap index when opening. Default: 0
   */
  initialSnapIndex?: number;
  /**
   * When true, measures content dynamically and caps the lowest snap point at the content height.
   */
  enableDynamicSizing?: boolean;
  /**
   * Defer content rendering until the open animation completes. Default: false
   */
  lazy?: boolean;
  /**
   * Allow drag/gesture-to-close. Default: true
   */
  enableDragToClose?: boolean;
  /**
   * Allow clicking the backdrop to close the sheet. Default: true
   */
  enableBackdropDismiss?: boolean;
  /**
   * Render via portal to escape z-index issues. Default: false
   */
  portal?: boolean;
  /**
   * Theme override merging with provider theme / defaults.
   */
  theme?: Partial<BottomSheetTheme>;
  /**
   * Custom style overrides for the sheet components.
   */
  style?: BottomSheetStyleOverrides;
  /**
   * Accessibility properties for the modal.
   */
  accessibilityProps?: {
    accessibilityViewIsModal?: boolean;
    importantForAccessibility?: 'auto' | 'yes' | 'no' | 'no-hide-descendants';
  };
  /**
   * Custom duration and easing functions.
   */
  animationConfig?: BottomSheetAnimationConfig;
  /**
   * Callback fired when the bottom sheet snaps to a new index.
   */
  onSnap?: (index: number) => void;
  /**
   * Custom handle renderer.
   */
  renderHandle?: (props: { theme: BottomSheetTheme }) => ReactNode;
  /**
   * Custom backdrop renderer.
   */
  renderBackdrop?: (props: {
    onPress: () => void;
    animatedStyle: object;
  }) => ReactNode;
  /**
   * Inner content. Can be standard React elements or a render prop function.
   */
  children?: ReactNode | ((props: BottomSheetRenderProps) => ReactNode);
  /**
   * When true, wraps the sheet content in a KeyboardAvoidingView to handle keyboard avoidance automatically.
   */
  avoidKeyboard?: boolean;
}
