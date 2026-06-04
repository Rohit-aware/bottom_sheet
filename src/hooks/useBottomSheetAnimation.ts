import { useAnimatedStyle, useSharedValue } from 'react-native-reanimated';
import { calculateOverlayOpacity } from '../utils/animationMath';

export interface UseBottomSheetAnimationProps {
  maxHeight: number;
  resolvedSnapPoints: { value: number[] };
  keyboardOffset: { value: number };
}

/**
 * Hook managing the sheet's active Y translation value and returning the animated styles.
 */
export const useBottomSheetAnimation = ({
  maxHeight,
  resolvedSnapPoints,
  keyboardOffset,
}: UseBottomSheetAnimationProps) => {
  const sheetTranslateY = useSharedValue(maxHeight);

  const sheetViewportAnimatedStyle = useAnimatedStyle(() => {
    return {
      transform: [
        {
          translateY: Math.max(0, sheetTranslateY.value - keyboardOffset.value),
        },
      ],
    };
  });

  const overlayAnimatedStyle = useAnimatedStyle(() => {
    const points = resolvedSnapPoints.value;
    const baseHeight = points.length > 0 ? points[0] : maxHeight;
    const progress = calculateOverlayOpacity(
      sheetTranslateY.value,
      maxHeight,
      baseHeight,
    );
    return {
      opacity: progress,
    };
  });

  return {
    sheetTranslateY,
    sheetViewportAnimatedStyle,
    overlayAnimatedStyle,
  };
};
export type UseBottomSheetAnimationResult = ReturnType<
  typeof useBottomSheetAnimation
>;
