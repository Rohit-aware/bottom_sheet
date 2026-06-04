import { Easing } from 'react-native-reanimated';
import { DEFAULT_ANIMATION_DURATION } from '../constants/defaults';
import type { BottomSheetAnimationConfig } from '../types/props';

export interface ResolvedAnimationConfig {
  duration: number;
  openEasing: (value: number) => number;
  closeEasing: (value: number) => number;
  snapEasing: (value: number) => number;
}

export const resolveAnimationConfig = (
  config?: BottomSheetAnimationConfig,
): ResolvedAnimationConfig => ({
  duration: config?.duration ?? DEFAULT_ANIMATION_DURATION,
  openEasing: config?.openEasing ?? Easing.out(Easing.cubic),
  closeEasing: config?.closeEasing ?? Easing.out(Easing.cubic),
  snapEasing: config?.snapEasing ?? Easing.inOut(Easing.ease),
});
