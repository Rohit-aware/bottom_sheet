import { DEFAULT_GESTURE_THRESHOLDS } from '../constants/defaults';

export type GestureDecisionResult =
  | { action: 'close' }
  | { action: 'snap'; index: number };

export type GestureDecisionInput = {
  velocityY: number;
  translationY: number;
  currentTranslateY: number;
  snapPointTranslateYs: number[]; // translateY for each snap point (ascending heights, meaning descending translateY)
  currentSnapIndex: number;
  maxHeight: number;
};

export type GestureThresholds = {
  closeVelocity: number;
  closeFromTopVelocity: number;
  snapUpVelocity: number;
  snapDownVelocity: number;
  velocityProjectionFactor: number;
  topSnapCloseRatio: number;
  lowerSnapCloseRatio: number;
};

/**
 * Pure function that decides what action to take (close or snap to a index) when a drag gesture ends.
 * Can run as a worklet on the UI thread.
 */
export const resolveGestureEnd = (
  input: GestureDecisionInput,
  thresholds?: GestureThresholds,
): GestureDecisionResult => {
  'worklet';

  const activeThresholds = thresholds ?? DEFAULT_GESTURE_THRESHOLDS;
  const {
    velocityY,
    currentTranslateY,
    snapPointTranslateYs,
    currentSnapIndex,
    maxHeight,
  } = input;

  if (snapPointTranslateYs.length === 0) {
    return { action: 'close' };
  }

  const topIndex = snapPointTranslateYs.length - 1;
  const currentSnapTranslateY = snapPointTranslateYs[currentSnapIndex];
  
  // Dragged down is positive when sheet is below the current snap point
  const draggedDown = Math.max(currentTranslateY - currentSnapTranslateY, 0);
  const hasMultipleSnaps = topIndex > 0;
  const isAtTopSnap = currentSnapIndex === topIndex;

  const snap0TranslateY = snapPointTranslateYs[0];
  const projectedY = currentTranslateY + velocityY * activeThresholds.velocityProjectionFactor;

  // Close decision
  const shouldCloseFromLower =
    velocityY > activeThresholds.closeVelocity ||
    draggedDown > maxHeight * activeThresholds.lowerSnapCloseRatio;

  const shouldCloseFromTop =
    velocityY > activeThresholds.closeFromTopVelocity ||
    projectedY > snap0TranslateY + (maxHeight - snap0TranslateY) * activeThresholds.topSnapCloseRatio;

  const shouldClose = !hasMultipleSnaps
    ? shouldCloseFromLower
    : isAtTopSnap
      ? shouldCloseFromTop
      : shouldCloseFromLower;

  if (shouldClose) {
    return { action: 'close' };
  }

  // Snap decision — find nearest snap point
  let nearestIndex = 0;
  let minDistance = Math.abs(currentTranslateY - snap0TranslateY);

  for (let i = 1; i < snapPointTranslateYs.length; i++) {
    const dist = Math.abs(currentTranslateY - snapPointTranslateYs[i]);
    if (dist < minDistance) {
      minDistance = dist;
      nearestIndex = i;
    }
  }

  // Velocity overrides
  if (hasMultipleSnaps && velocityY < activeThresholds.snapUpVelocity) {
    nearestIndex = topIndex;
  }
  if (hasMultipleSnaps && isAtTopSnap && velocityY > activeThresholds.snapDownVelocity) {
    nearestIndex = 0;
  }

  return { action: 'snap', index: nearestIndex };
};
