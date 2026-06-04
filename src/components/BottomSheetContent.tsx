import React, { ReactNode } from 'react';
import { LayoutChangeEvent, StyleSheet, View } from 'react-native';
import Animated, { FadeIn } from 'react-native-reanimated';
import { BottomSheetProvider } from '../context/BottomSheetContext';
import type { BottomSheetContextValue } from '../types/internal';
import type { BottomSheetRenderProps, BottomSheetStyleOverrides } from '../types/props';

export interface BottomSheetContentProps {
  renderContent: boolean;
  enableDynamicSizing: boolean;
  bottomInset: number;
  handleDynamicContentLayout: (event: LayoutChangeEvent) => void;
  contextValue: BottomSheetContextValue;
  renderProps: BottomSheetRenderProps;
  children?: ReactNode | ((props: BottomSheetRenderProps) => ReactNode);
  style?: BottomSheetStyleOverrides;
}

/**
 * Component that lazily renders sheet content and handles dynamic sizing measurements.
 */
export const BottomSheetContent = React.memo(
  ({
    renderContent,
    enableDynamicSizing,
    bottomInset,
    handleDynamicContentLayout,
    contextValue,
    renderProps,
    children,
    style: styleOverrides,
  }: BottomSheetContentProps) => {
    if (!renderContent) {
      return null;
    }

    const resolvedChildren =
      typeof children === 'function' ? children(renderProps) : children;

    return (
      <View style={[styles.contentContainer, styleOverrides?.contentContainer]}>
        <BottomSheetProvider value={contextValue}>
          <Animated.View
            entering={FadeIn.duration(250)}
            style={styles.sheetContentContainer}
          >
            {enableDynamicSizing ? (
              <View
                onLayout={handleDynamicContentLayout}
                style={{ paddingBottom: bottomInset }}
              >
                {resolvedChildren}
              </View>
            ) : (
              resolvedChildren
            )}
          </Animated.View>
        </BottomSheetProvider>
      </View>
    );
  },
);

BottomSheetContent.displayName = 'BottomSheetContent';

const styles = StyleSheet.create({
  contentContainer: {
    flex: 1,
  },
  sheetContentContainer: {
    flex: 1,
  },
});
