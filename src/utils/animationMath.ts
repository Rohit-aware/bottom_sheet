import { Easing, WithTimingConfig } from 'react-native-reanimated';
import { DEFAULT_ANIMATION_DURATION } from '../constants/defaults';

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
