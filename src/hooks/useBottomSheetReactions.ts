import { useAnimatedReaction, withTiming } from 'react-native-reanimated';
import { scheduleOnRN } from 'react-native-worklets';
import { resolveAnimationConfig } from '../utils/resolveAnimationConfig';
import type { BottomSheetAnimationConfig } from '../types/props';
import { getTimingConfig } from '../utils/animationMath';
import { getBottomSheetSnapPointTranslateY } from '../utils/snapPointMath';

export interface UseBottomSheetReactionsProps {
  visible: boolean;
  enableDynamicSizing: boolean;
  isOpening: { value: boolean };
  contentHeight: { value: number | undefined };
  resolvedSnapPoints: { value: number[] };
  maxHeight: number;
  sheetTranslateY: { value: number };
  animationConfig?: BottomSheetAnimationConfig;
  onSnap?: (index: number) => void;
  isOpen: { value: boolean };
  currentSnapIndex: { value: number };
  topSnapIndex: { value: number };
}

export const useBottomSheetReactions = ({
  visible,
  enableDynamicSizing,
  isOpening,
  contentHeight,
  resolvedSnapPoints,
  maxHeight,
  sheetTranslateY,
  animationConfig,
  onSnap,
  isOpen,
  currentSnapIndex,
  topSnapIndex,
}: UseBottomSheetReactionsProps) => {
  const { duration, openEasing, snapEasing } = resolveAnimationConfig(animationConfig);

  // Handle dynamic sizing opening animation when content height gets measured
  useAnimatedReaction(
    () => {
      if (!visible || !enableDynamicSizing || !isOpening.value || contentHeight.value === undefined) {
        return undefined;
      }
      return getBottomSheetSnapPointTranslateY({
        snapPoints: resolvedSnapPoints.value,
        maxHeight,
        snapIndex: 0,
      });
    },
    (next, prev) => {
      if (next === undefined || next === prev) return;
      sheetTranslateY.value = withTiming(next, getTimingConfig(duration, openEasing), (fin) => {
        if (fin) {
          isOpening.value = false;
          if (onSnap) scheduleOnRN(onSnap, 0);
        }
      });
    },
    [
      resolvedSnapPoints,
      contentHeight,
      enableDynamicSizing,
      isOpening,
      maxHeight,
      sheetTranslateY,
      visible,
      duration,
      openEasing,
      onSnap,
    ],
  );

  // Dimension / Snap alignment reaction
  useAnimatedReaction(
    () => {
      if (!visible || !isOpen.value || isOpening.value) return undefined;
      const index = Math.min(currentSnapIndex.value, topSnapIndex.value);
      return {
        index,
        translateY: getBottomSheetSnapPointTranslateY({
          snapPoints: resolvedSnapPoints.value,
          maxHeight,
          snapIndex: index,
        }),
      };
    },
    (next) => {
      if (!next) return;
      if (currentSnapIndex.value !== next.index) currentSnapIndex.value = next.index;
      if (Math.abs(sheetTranslateY.value - next.translateY) < 1) return;
      sheetTranslateY.value = withTiming(next.translateY, getTimingConfig(duration, snapEasing));
    },
    [
      resolvedSnapPoints,
      currentSnapIndex,
      isOpen,
      isOpening,
      maxHeight,
      sheetTranslateY,
      topSnapIndex,
      visible,
      duration,
      snapEasing,
    ],
  );
};
