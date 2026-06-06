import { useSharedValue } from 'react-native-reanimated';
import { usePanGesture } from 'react-native-gesture-handler';
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

  const handlePanGesture = usePanGesture({
    enabled: renderContent,
    onBegin: () => {
      panStartTranslateY.value = sheetTranslateY.value;
    },
    onUpdate: (event) => {
      const nextTranslateY = panStartTranslateY.value + event.translationY;
      sheetTranslateY.value = Math.min(Math.max(nextTranslateY, 0), maxHeight);
    },
    onDeactivate: (event) => {
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
    },
  });

  const contentPanGesture = usePanGesture({
    enabled: renderContent && enableContentGesture,
    onBegin: () => {
      panStartTranslateY.value = sheetTranslateY.value;
    },
    onUpdate: (event) => {
      const nextTranslateY = panStartTranslateY.value + event.translationY;
      sheetTranslateY.value = Math.min(Math.max(nextTranslateY, 0), maxHeight);
    },
    onDeactivate: (event) => {
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
    },
  });

  return {
    handlePanGesture,
    contentPanGesture,
  };
};
