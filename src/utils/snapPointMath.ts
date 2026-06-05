import { BOTTOM_SHEET_HANDLE_TOTAL_HEIGHT } from '../constants/defaults';
import type { SnapPoint } from '../types/props';

export const resolveSnapPoint = (
  snapPoint: SnapPoint,
  maxHeight: number,
): number => {
  'worklet';
  if (typeof snapPoint === 'number') {
    return Math.min(snapPoint, maxHeight);
  }
  const percent = parseFloat(snapPoint) / 100;
  if (isNaN(percent)) {
    return maxHeight;
  }
  return Math.min(maxHeight * percent, maxHeight);
};

export const getBottomSheetSnapPoints = ({
  snapPoints,
  maxHeight,
  contentHeight,
  enableDynamicSizing,
}: {
  snapPoints: SnapPoint[];
  maxHeight: number;
  contentHeight: number | undefined;
  enableDynamicSizing: boolean;
}): number[] => {
  'worklet';

  if (!snapPoints || snapPoints.length === 0) {
    return [maxHeight];
  }

  
  const resolved = snapPoints.map((sp) => resolveSnapPoint(sp, maxHeight));

  
  if (enableDynamicSizing && contentHeight !== undefined && resolved.length > 0) {
    const measuredHeight = Math.max(0, contentHeight) + BOTTOM_SHEET_HANDLE_TOTAL_HEIGHT;
    resolved[0] = Math.min(measuredHeight, resolved[0]);
  }

  
  const sorted = resolved.sort((a, b) => a - b);
  const unique: number[] = [];
  for (let i = 0; i < sorted.length; i++) {
    if (unique.length === 0 || Math.abs(sorted[i] - unique[unique.length - 1]) > 0.1) {
      unique.push(sorted[i]);
    }
  }

  return unique.length > 0 ? unique : [maxHeight];
};

export const getBottomSheetSnapPointTranslateY = ({
  snapPoints,
  maxHeight,
  snapIndex,
}: {
  snapPoints: number[];
  maxHeight: number;
  snapIndex: number;
}): number => {
  'worklet';
  if (!snapPoints || snapPoints.length === 0) {
    return maxHeight;
  }
  const index = Math.min(Math.max(0, snapIndex), snapPoints.length - 1);
  const snapHeight = snapPoints[index];
  return maxHeight - snapHeight;
};

export const getBottomSheetTopSnapIndex = (snapPoints: number[]): number => {
  'worklet';
  return Math.max(0, snapPoints.length - 1);
};
