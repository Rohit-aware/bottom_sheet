import React, { ReactNode, useMemo } from 'react';
import { StyleSheet, KeyboardAvoidingView, Platform } from 'react-native';
import Animated from 'react-native-reanimated';
import { GestureDetector, type PanGesture } from 'react-native-gesture-handler';
import { BottomSheetHandle } from './BottomSheetHandle';
import { BottomSheetContent } from './BottomSheetContent';
import type { BottomSheetTheme } from '../theme/types';
import type { BottomSheetStyleOverrides, BottomSheetRenderProps } from '../types/props';
import type { UseBottomSheetLayoutResult } from '../hooks/useBottomSheetLayout';
import type { UseBottomSheetAnimationResult } from '../hooks/useBottomSheetAnimation';
import type { UseBottomSheetControllerResult } from '../hooks/useBottomSheetController';

export interface BottomSheetViewProps {
  theme: BottomSheetTheme;
  layout: UseBottomSheetLayoutResult;
  animation: UseBottomSheetAnimationResult;
  controller: UseBottomSheetControllerResult;
  handlePanGesture: PanGesture;
  contentPanGesture: PanGesture;
  style?: BottomSheetStyleOverrides;
  renderHandle?: (props: { theme: BottomSheetTheme }) => ReactNode;
  enableDynamicSizing?: boolean;
  children?: ReactNode | ((props: BottomSheetRenderProps) => ReactNode);
  avoidKeyboard?: boolean;
}

export const BottomSheetView = React.memo(({
  theme,
  layout,
  animation,
  controller,
  handlePanGesture,
  contentPanGesture,
  style: styleOverrides,
  renderHandle,
  enableDynamicSizing = false,
  children,
  avoidKeyboard = false,
}: BottomSheetViewProps) => {
  const controllerProps = useMemo(() => ({
    close: controller.close,
    snapToIndex: controller.snapToIndex,
    expand: () => controller.snapToIndex(layout.resolvedSnapPoints.value.length - 1),
    collapse: () => controller.snapToIndex(0),
    currentSnapIndex: controller.currentSnapIndex,
  }), [controller.close, controller.snapToIndex, controller.currentSnapIndex, layout.resolvedSnapPoints]);

  const content = (
    <BottomSheetContent
      renderContent={controller.renderContent}
      enableDynamicSizing={enableDynamicSizing}
      bottomInset={layout.bottomInset}
      handleDynamicContentLayout={layout.handleDynamicContentLayout}
      contextValue={{
        close: controller.close,
        currentSnapIndex: controller.currentSnapIndex,
        topSnapIndex: layout.topSnapIndex,
      }}
      renderProps={controllerProps}
      style={styleOverrides}
    >
      {children}
    </BottomSheetContent>
  );

  return (
    <Animated.View pointerEvents="box-none" style={[{ height: layout.maxHeight }, animation.sheetViewportAnimatedStyle]}>
      <Animated.View style={[styles.container, {
        height: layout.maxHeight,
        backgroundColor: theme.colors.background,
        borderTopLeftRadius: theme.radius.container,
        borderTopRightRadius: theme.radius.container,
      }, styleOverrides?.container]}>
        <GestureDetector gesture={handlePanGesture}>
          <Animated.View>
            {renderHandle ? renderHandle({ theme }) : <BottomSheetHandle theme={theme} style={styleOverrides} />}
          </Animated.View>
        </GestureDetector>

        <GestureDetector gesture={contentPanGesture}>
          <Animated.View style={styles.contentWrapper} pointerEvents="box-none">
            {avoidKeyboard ? (
              <KeyboardAvoidingView
                behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                style={styles.keyboardAvoidingView}
              >
                {content}
              </KeyboardAvoidingView>
            ) : content}
          </Animated.View>
        </GestureDetector>
      </Animated.View>
    </Animated.View>
  );
});

BottomSheetView.displayName = 'BottomSheetView';

const styles = StyleSheet.create({
  container: { overflow: 'hidden' },
  contentWrapper: { flex: 1 },
  keyboardAvoidingView: { flex: 1 },
});
