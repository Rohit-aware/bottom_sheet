import React, { forwardRef, useImperativeHandle, useState, useEffect } from 'react';
import { Modal, StyleSheet } from 'react-native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { useAnimatedReaction } from 'react-native-reanimated';
import { scheduleOnRN } from 'react-native-worklets';
import { BottomSheetBackdrop } from './BottomSheetBackdrop';
import { BottomSheetView } from './BottomSheetView';
import { useBottomSheetLayout } from '../hooks/useBottomSheetLayout';
import { useKeyboardBehavior } from '../hooks/useKeyboardBehavior';
import { useBottomSheetAnimation } from '../hooks/useBottomSheetAnimation';
import { useBottomSheetController } from '../hooks/useBottomSheetController';
import { useBottomSheetGesture } from '../hooks/useBottomSheetGesture';
import { useResolvedTheme } from '../theme/useResolvedTheme';
import { useStableCallback } from '../hooks/useStableCallback';
import type { BottomSheetProps } from '../types/props';
import type { BottomSheetRef } from '../types/ref';

export const BottomSheet = forwardRef<BottomSheetRef, BottomSheetProps>(
  (props, ref) => {
    const [modalVisible, setModalVisible] = useState(props.visible);
    const resolvedTheme = useResolvedTheme(props.theme);

    const layout = useBottomSheetLayout({
      snapPoints: props.snapPoints,
      enableDynamicSizing: props.enableDynamicSizing,
      visible: modalVisible,
    });

    const keyboardOffset = useKeyboardBehavior(modalVisible);

    const animation = useBottomSheetAnimation({
      maxHeight: layout.maxHeight,
      resolvedSnapPoints: layout.resolvedSnapPoints,
      keyboardOffset,
    });

    const controller = useBottomSheetController({
      visible: modalVisible,
      onClose: props.onClose,
      onSnap: props.onSnap,
      initialSnapIndex: props.initialSnapIndex ?? 0,
      enableDynamicSizing: props.enableDynamicSizing ?? false,
      lazy: props.lazy ?? false,
      maxHeight: layout.maxHeight,
      contentHeight: layout.contentHeight,
      resolvedSnapPoints: layout.resolvedSnapPoints,
      snapPointTranslateYs: layout.snapPointTranslateYs,
      topSnapIndex: layout.topSnapIndex,
      sheetTranslateY: animation.sheetTranslateY,
      keyboardOffset,
      animationConfig: props.animationConfig,
    });

    useEffect(() => {
      if (props.visible) {
        setModalVisible(true);
      } else {
        if (controller.isOpen.value) {
          controller.close(() => {
            setModalVisible(false);
          });
        } else {
          setModalVisible(false);
        }
      }
    }, [props.visible, controller.close, controller.isOpen]);

    const [enableContentGesture, setEnableContentGesture] = useState(true);

    useAnimatedReaction(
      () => {
        return controller.currentSnapIndex.value < layout.topSnapIndex.value;
      },
      (shouldEnable, prevShouldEnable) => {
        if (shouldEnable !== prevShouldEnable) {
          scheduleOnRN(setEnableContentGesture, shouldEnable);
        }
      },
      [controller.currentSnapIndex, layout.topSnapIndex],
    );

    const { handlePanGesture, contentPanGesture } = useBottomSheetGesture({
      renderContent: controller.renderContent,
      maxHeight: layout.maxHeight,
      enableDragToClose: props.enableDragToClose ?? true,
      sheetTranslateY: animation.sheetTranslateY,
      currentSnapIndex: controller.currentSnapIndex,
      resolvedSnapPoints: layout.resolvedSnapPoints,
      snapPointTranslateYs: layout.snapPointTranslateYs,
      topSnapIndex: layout.topSnapIndex,
      closeFromGesture: controller.closeFromGesture,
      snapToIndex: controller.snapToIndex,
      enableContentGesture,
    });

    
    useImperativeHandle(
      ref,
      () => ({
        open: () => controller.open(),
        close: (callback) => controller.close(callback),
        snapToIndex: (index) => controller.snapToIndex(index),
        expand: () => controller.snapToIndex(layout.resolvedSnapPoints.value.length - 1),
        collapse: () => controller.snapToIndex(0),
      }),
      [controller, layout.resolvedSnapPoints],
    );

    const onBackdropPress = useStableCallback(() => {
      if (props.enableBackdropDismiss ?? true) {
        controller.close();
      }
    });

    if (!modalVisible) {
      return null;
    }

    return (
      <Modal
        onRequestClose={props.onClose}
        transparent
        visible={modalVisible}
        {...(props.accessibilityProps || {})}
      >
        <GestureHandlerRootView style={styles.sheetContentContainer}>
          <BottomSheetBackdrop
            onPress={onBackdropPress}
            animatedStyle={animation.overlayAnimatedStyle}
            renderBackdrop={props.renderBackdrop}
            theme={resolvedTheme}
            style={props.style}
          />

          <BottomSheetView
            theme={resolvedTheme}
            layout={layout}
            animation={animation}
            controller={controller}
            handlePanGesture={handlePanGesture}
            contentPanGesture={contentPanGesture}
            style={props.style}
            renderHandle={props.renderHandle}
            enableDynamicSizing={props.enableDynamicSizing}
            avoidKeyboard={props.avoidKeyboard}
          >
            {props.children}
          </BottomSheetView>
        </GestureHandlerRootView>
      </Modal>
    );
  },
);

BottomSheet.displayName = 'BottomSheet';

const styles = StyleSheet.create({
  sheetContentContainer: {
    flex: 1,
  },
});
