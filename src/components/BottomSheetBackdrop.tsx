import React, { ReactNode } from 'react';
import { Pressable, StyleSheet } from 'react-native';
import Animated from 'react-native-reanimated';
import type { BottomSheetTheme } from '../theme/types';
import type { BottomSheetStyleOverrides } from '../types/props';

export interface BottomSheetBackdropProps {
  onPress: () => void;
  animatedStyle: object;
  renderBackdrop?: (props: { onPress: () => void; animatedStyle: object }) => ReactNode;
  theme: BottomSheetTheme;
  style?: BottomSheetStyleOverrides;
}

export const BottomSheetBackdrop = React.memo(
  ({
    onPress,
    animatedStyle,
    renderBackdrop,
    theme,
    style: styleOverrides,
  }: BottomSheetBackdropProps) => {
    if (renderBackdrop) {
      return <>{renderBackdrop({ onPress, animatedStyle })}</>;
    }

    return (
      <>
        <Animated.View
          pointerEvents="none"
          style={[
            StyleSheet.absoluteFill,
            styles.backdrop,
            { backgroundColor: theme.colors.backdrop },
            styleOverrides?.backdrop,
            animatedStyle,
          ]}
        />
        <Pressable
          onPress={onPress}
          style={[StyleSheet.absoluteFill, styleOverrides?.overlay]}
        />
      </>
    );
  },
);

BottomSheetBackdrop.displayName = 'BottomSheetBackdrop';

const styles = StyleSheet.create({
  backdrop: {
    position: 'absolute',
    left: 0,
    right: 0,
    top: 0,
    bottom: 0,
  },
});
