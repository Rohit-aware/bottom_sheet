import { useState } from 'react';
import { useSharedValue } from 'react-native-reanimated';
import { useStableCallback } from './useStableCallback';
import { useBottomSheetActions } from './useBottomSheetActions';
import { useBottomSheetEffects } from './useBottomSheetEffects';
import { useBottomSheetReactions } from './useBottomSheetReactions';
import type { BottomSheetAnimationConfig } from '../types/props';

export interface UseBottomSheetControllerProps {
  visible: boolean;
  onClose: () => void;
  onSnap?: (index: number) => void;
  initialSnapIndex: number;
  enableDynamicSizing: boolean;
  lazy: boolean;
  maxHeight: number;
  contentHeight: { value: number | undefined };
  resolvedSnapPoints: { value: number[] };
  snapPointTranslateYs: { value: number[] };
  topSnapIndex: { value: number };
  sheetTranslateY: { value: number };
  keyboardOffset: { value: number };
  animationConfig?: BottomSheetAnimationConfig;
}

/**
 * Controller hook managing the open, close, and snapping state machine of the bottom sheet.
 */
export const useBottomSheetController = ({
  visible,
  onClose,
  onSnap,
  initialSnapIndex,
  enableDynamicSizing,
  lazy,
  maxHeight,
  contentHeight,
  resolvedSnapPoints,
  topSnapIndex,
  sheetTranslateY,
  keyboardOffset,
  animationConfig,
}: UseBottomSheetControllerProps) => {
  const isOpen = useSharedValue(false);
  const isOpening = useSharedValue(false);
  const currentSnapIndex = useSharedValue(0);

  const [renderContent, setRenderContent] = useState(!lazy);

  const showContent = useStableCallback(() => {
    if (lazy) {
      setRenderContent(true);
    }
  });

  const actions = useBottomSheetActions({
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
  });

  useBottomSheetEffects({
    visible,
    enableDynamicSizing,
    isOpen,
    isOpening,
    maxHeight,
    open: actions.open,
    sheetTranslateY,
    currentSnapIndex,
    keyboardOffset,
    contentHeight,
    setRenderContent,
    lazy,
    initialSnapIndex,
  });

  useBottomSheetReactions({
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
  });

  return {
    isOpen,
    isOpening,
    currentSnapIndex,
    renderContent,
    showContent,
    open: actions.open,
    close: actions.close,
    closeFromGesture: actions.closeFromGesture,
    snapToIndex: actions.snapToIndex,
  };
};

export type UseBottomSheetControllerResult = ReturnType<
  typeof useBottomSheetController
>;
