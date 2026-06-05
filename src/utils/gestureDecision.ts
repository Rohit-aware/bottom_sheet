import { DEFAULT_GESTURE_THRESHOLDS } from '../constants/defaults';

export type GestureDecisionResult =
  | { action: 'close' }
  | { action: 'snap'; index: number };

export type GestureDecisionInput = {
  velocityY: number;
  translationY: number;
  currentTranslateY: number;
  snapPointTranslateYs: number[];
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
  
  const draggedDown = Math.max(currentTranslateY - currentSnapTranslateY, 0);
  const hasMultipleSnaps = topIndex > 0;
  const isAtTopSnap = currentSnapIndex === topIndex;

  const snap0TranslateY = snapPointTranslateYs[0];
  const projectedY = currentTranslateY + velocityY * activeThresholds.velocityProjectionFactor;

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

  let nearestIndex = 0;
  let minDistance = Math.abs(currentTranslateY - snap0TranslateY);

  for (let i = 1; i < snapPointTranslateYs.length; i++) {
    const dist = Math.abs(currentTranslateY - snapPointTranslateYs[i]);
    if (dist < minDistance) {
      minDistance = dist;
      nearestIndex = i;
    }
  }

  if (hasMultipleSnaps && velocityY < activeThresholds.snapUpVelocity) {
    nearestIndex = topIndex;
  }
  if (hasMultipleSnaps && isAtTopSnap && velocityY > activeThresholds.snapDownVelocity) {
    nearestIndex = 0;
  }

  return { action: 'snap', index: nearestIndex };
};
