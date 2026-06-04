import { useWindowDimensions, Platform, LayoutChangeEvent } from 'react-native';
import { useDerivedValue, useSharedValue } from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { ANDROID_HEIGHT_OFFSET } from '../constants/defaults';
import type { SnapPoint } from '../types/props';
import {
  getBottomSheetSnapPoints,
  getBottomSheetSnapPointTranslateY,
  getBottomSheetTopSnapIndex,
} from '../utils/snapPointMath';
import { useStableCallback } from './useStableCallback';

export interface UseBottomSheetLayoutProps {
  snapPoints: SnapPoint[];
  enableDynamicSizing?: boolean;
  visible: boolean;
}

/**
 * Hook managing bottom sheet measurements, safe area layout boundaries,
 * and snap point height calculations.
 */
export const useBottomSheetLayout = ({
  snapPoints,
  enableDynamicSizing = false,
  visible: _visible,
}: UseBottomSheetLayoutProps) => {
  const { height: windowHeight } = useWindowDimensions();
  const { top: topInset, bottom: bottomInset } = useSafeAreaInsets();

  const maxHeight = Math.max(
    0,
    windowHeight - topInset - (Platform.OS === 'android' ? bottomInset + ANDROID_HEIGHT_OFFSET : 0),
  );

  const contentHeight = useSharedValue<number | undefined>(undefined);

  const resolvedSnapPoints = useDerivedValue(() => {
    return getBottomSheetSnapPoints({
      snapPoints,
      maxHeight,
      contentHeight: contentHeight.value,
      enableDynamicSizing,
    });
  }, [snapPoints, maxHeight, enableDynamicSizing]);

  const snapPointTranslateYs = useDerivedValue(() => {
    const points = resolvedSnapPoints.value;
    return points.map((_, index) =>
      getBottomSheetSnapPointTranslateY({
        snapPoints: points,
        maxHeight,
        snapIndex: index,
      }),
    );
  }, [resolvedSnapPoints, maxHeight]);

  const topSnapIndex = useDerivedValue(() => {
    return getBottomSheetTopSnapIndex(resolvedSnapPoints.value);
  }, [resolvedSnapPoints]);

  const handleDynamicContentLayout = useStableCallback((event: LayoutChangeEvent) => {
    if (!enableDynamicSizing) {
      return;
    }

    const nextContentHeight = Math.ceil(event.nativeEvent.layout.height);

    if (contentHeight.value === nextContentHeight) {
      return;
    }

    contentHeight.value = nextContentHeight;
  });

  return {
    maxHeight,
    bottomInset,
    contentHeight,
    resolvedSnapPoints,
    snapPointTranslateYs,
    topSnapIndex,
    handleDynamicContentLayout,
  };
};
export type UseBottomSheetLayoutResult = ReturnType<typeof useBottomSheetLayout>;
