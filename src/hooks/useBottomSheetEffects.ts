import { useLayoutEffect, useEffect, useRef } from 'react';

export interface UseBottomSheetEffectsProps {
  visible: boolean;
  enableDynamicSizing: boolean;
  isOpen: { value: boolean };
  isOpening: { value: boolean };
  maxHeight: number;
  open: (shouldShowContent?: boolean, initialSnapIndex?: number) => void;
  sheetTranslateY: { value: number };
  currentSnapIndex: { value: number };
  keyboardOffset: { value: number };
  contentHeight: { value: number | undefined };
  setRenderContent: (render: boolean) => void;
  lazy: boolean;
  initialSnapIndex: number;
}

export const useBottomSheetEffects = ({
  visible,
  enableDynamicSizing,
  isOpen,
  isOpening,
  maxHeight,
  open,
  sheetTranslateY,
  currentSnapIndex,
  keyboardOffset,
  contentHeight,
  setRenderContent,
  lazy,
  initialSnapIndex,
}: UseBottomSheetEffectsProps) => {
  const hasCommittedVisibilityRef = useRef(false);
  const wasVisibleRef = useRef(false);

  // Modal opening layout effect
  useLayoutEffect(() => {
    const wasVisible = hasCommittedVisibilityRef.current ? wasVisibleRef.current : false;
    hasCommittedVisibilityRef.current = true;
    wasVisibleRef.current = visible;

    if (!visible || wasVisible) {
      return;
    }

    isOpen.value = true;
    isOpening.value = true;
    currentSnapIndex.value = 0;
    sheetTranslateY.value = maxHeight;

    if (enableDynamicSizing) {
      setRenderContent(true);
      return;
    }

    open(true, initialSnapIndex);
  }, [
    enableDynamicSizing,
    visible,
    isOpen,
    isOpening,
    maxHeight,
    open,
    sheetTranslateY,
    currentSnapIndex,
    initialSnapIndex,
    setRenderContent,
  ]);

  // Hard visibility change / hidden cleanup
  useEffect(() => {
    if (visible) return;

    isOpen.value = false;
    isOpening.value = false;
    keyboardOffset.value = 0;
    currentSnapIndex.value = 0;
    sheetTranslateY.value = maxHeight;
    contentHeight.value = undefined;
    setRenderContent(!lazy);
  }, [
    contentHeight,
    visible,
    lazy,
    isOpen,
    isOpening,
    keyboardOffset,
    maxHeight,
    sheetTranslateY,
    currentSnapIndex,
    setRenderContent,
  ]);
};
