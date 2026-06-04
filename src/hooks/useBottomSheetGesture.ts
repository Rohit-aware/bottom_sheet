import { useMemo, useCallback } from 'react';
import { Gesture } from 'react-native-gesture-handler';
import { useSharedValue } from 'react-native-reanimated';
import { scheduleOnRN } from 'react-native-worklets';
import {
  resolveGestureEnd,
  GestureThresholds,
} from '../utils/gestureDecision';
import { useStableCallback } from './useStableCallback';

export interface UseBottomSheetGestureProps {
  renderContent: boolean;
  maxHeight: number;
  enableDragToClose?: boolean;
  sheetTranslateY: { value: number };
  currentSnapIndex: { value: number };
  resolvedSnapPoints: { value: number[] };
  snapPointTranslateYs: { value: number[] };
  topSnapIndex: { value: number };
  closeFromGesture: () => void;
  snapToIndex: (index: number) => void;
  gestureThresholds?: GestureThresholds;
  enableContentGesture?: boolean;
}

/**
 * Hook to build and memoize the pan gesture.
 */
export const useBottomSheetGesture = ({
  renderContent,
  maxHeight,
  enableDragToClose = true,
  sheetTranslateY,
  currentSnapIndex,
  snapPointTranslateYs,
  closeFromGesture,
  snapToIndex,
  gestureThresholds,
  enableContentGesture = true,
}: UseBottomSheetGestureProps) => {
  const panStartTranslateY = useSharedValue(0);

  const stableCloseFromGesture = useStableCallback(closeFromGesture);
  const stableSnapToIndex = useStableCallback(snapToIndex);

  const createPanGesture = useCallback(
    (enabled: boolean) => {
      return Gesture.Pan()
        .enabled(enabled)
        .onBegin(() => {
          panStartTranslateY.value = sheetTranslateY.value;
        })
        .onUpdate((event) => {
          const nextTranslateY = panStartTranslateY.value + event.translationY;
          sheetTranslateY.value = Math.min(Math.max(nextTranslateY, 0), maxHeight);
        })
        .onEnd((event) => {
          const decision = resolveGestureEnd(
            {
              velocityY: event.velocityY,
              translationY: event.translationY,
              currentTranslateY: sheetTranslateY.value,
              snapPointTranslateYs: snapPointTranslateYs.value,
              currentSnapIndex: currentSnapIndex.value,
              maxHeight,
            },
            gestureThresholds,
          );

          if (decision.action === 'close') {
            if (enableDragToClose) {
              scheduleOnRN(stableCloseFromGesture);
            } else {
              scheduleOnRN(stableSnapToIndex, 0);
            }
          } else {
            scheduleOnRN(stableSnapToIndex, decision.index);
          }
        });
    },
    [
      maxHeight,
      enableDragToClose,
      sheetTranslateY,
      currentSnapIndex,
      snapPointTranslateYs,
      gestureThresholds,
      panStartTranslateY,
      stableCloseFromGesture,
      stableSnapToIndex,
    ],
  );

  const handlePanGesture = useMemo(
    () => createPanGesture(renderContent),
    [renderContent, createPanGesture],
  );

  const contentPanGesture = useMemo(
    () => createPanGesture(renderContent && enableContentGesture),
    [renderContent, enableContentGesture, createPanGesture],
  );

  return {
    handlePanGesture,
    contentPanGesture,
  };
};
