import { Easing, WithTimingConfig } from 'react-native-reanimated';
import { DEFAULT_ANIMATION_DURATION } from '../constants/defaults';

/**
 * Calculates the opacity of the backdrop/overlay based on the sheet's current position.
 * Runs as a worklet.
 */
export const calculateOverlayOpacity = (
  sheetTranslateY: number,
  maxHeight: number,
  baseHeight: number,
): number => {
  'worklet';
  const visibleHeight = Math.max(0, maxHeight - sheetTranslateY);
  const threshold = Math.max(1, Math.min(baseHeight, maxHeight));
  return Math.min(1, visibleHeight / threshold);
};

/**
 * Generates Reanimated timing animation configs.
 * Runs as a worklet.
 */
export const getTimingConfig = (
  duration: number = DEFAULT_ANIMATION_DURATION,
  easing: (value: number) => number = Easing.out(Easing.cubic),
): WithTimingConfig => {
  'worklet';
  return {
    duration,
    easing,
  };
};
