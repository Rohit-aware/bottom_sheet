import { Keyboard, Platform } from 'react-native';
import { withTiming } from 'react-native-reanimated';
import { scheduleOnRN } from 'react-native-worklets';
import { resolveAnimationConfig } from '../utils/resolveAnimationConfig';
import type { BottomSheetAnimationConfig } from '../types/props';
import { getTimingConfig } from '../utils/animationMath';
import { getBottomSheetSnapPointTranslateY } from '../utils/snapPointMath';
import { useStableCallback } from './useStableCallback';

export interface UseBottomSheetActionsProps {
  isOpen: { value: boolean };
  isOpening: { value: boolean };
  currentSnapIndex: { value: number };
  sheetTranslateY: { value: number };
  maxHeight: number;
  resolvedSnapPoints: { value: number[] };
  animationConfig?: BottomSheetAnimationConfig;
  onSnap?: (index: number) => void;
  onClose: () => void;
  showContent: () => void;
}

export const useBottomSheetActions = ({
  isOpen,
  isOpening,
  currentSnapIndex,
  sheetTranslateY,
  maxHeight,
  resolvedSnapPoints,
  animationConfig,
  onSnap,
  onClose,
  showContent,
}: UseBottomSheetActionsProps) => {
  const { duration, openEasing, closeEasing, snapEasing } = resolveAnimationConfig(animationConfig);

  const finishClose = useStableCallback((callback?: () => void) => {
    onClose();
    if (callback) {
      if (Platform.OS === 'ios') callback();
      else setTimeout(callback, 100);
    }
  });

  const snapToIndex = useStableCallback((index: number) => {
    if (!isOpen.value) return;
    const points = resolvedSnapPoints.value;
    const clamped = Math.min(Math.max(0, index), points.length - 1);
    currentSnapIndex.value = clamped;
    const target = getBottomSheetSnapPointTranslateY({ snapPoints: points, maxHeight, snapIndex: clamped });

    sheetTranslateY.value = withTiming(target, getTimingConfig(duration, snapEasing), (finished) => {
      if (finished && onSnap) scheduleOnRN(onSnap, clamped);
    });
  });

  const open = useStableCallback((shouldShowContent: boolean = true, initialSnapIndex: number = 0) => {
    const points = resolvedSnapPoints.value;
    const targetIndex = Math.min(initialSnapIndex, points.length - 1);
    currentSnapIndex.value = targetIndex;
    const target = getBottomSheetSnapPointTranslateY({ snapPoints: points, maxHeight, snapIndex: targetIndex });

    sheetTranslateY.value = withTiming(target, getTimingConfig(duration, openEasing), (finished) => {
      if (!finished) return;
      isOpening.value = false;
      if (shouldShowContent) scheduleOnRN(showContent);
      if (onSnap) scheduleOnRN(onSnap, targetIndex);
    });
  });

  const closeFromGesture = useStableCallback(() => {
    Keyboard.dismiss();
    isOpen.value = false;
    isOpening.value = false;
    sheetTranslateY.value = withTiming(maxHeight, getTimingConfig(duration, closeEasing), (finished) => {
      if (finished) scheduleOnRN(onClose);
    });
  });

  const close = useStableCallback((callback?: () => void) => {
    if (!isOpen.value) return;
    Keyboard.dismiss();
    isOpen.value = false;
    isOpening.value = false;
    sheetTranslateY.value = withTiming(maxHeight, getTimingConfig(duration, closeEasing), (finished) => {
      if (finished) scheduleOnRN(finishClose, callback);
    });
  });

  return { snapToIndex, open, close, closeFromGesture };
};
