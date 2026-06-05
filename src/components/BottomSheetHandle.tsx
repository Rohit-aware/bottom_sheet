import React from 'react';
import { StyleSheet, View } from 'react-native';
import type { BottomSheetTheme } from '../theme/types';
import type { BottomSheetStyleOverrides } from '../types/props';

export interface BottomSheetHandleProps {
  theme: BottomSheetTheme;
  style?: BottomSheetStyleOverrides;
}

export const BottomSheetHandle = React.memo(
  ({ theme, style: styleOverrides }: BottomSheetHandleProps) => {
    const { colors, radius, spacing, sizing } = theme;

    return (
      <View
        style={[
          styles.handle,
          {
            backgroundColor: colors.handle,
            borderRadius: radius.handle,
            height: sizing.handleHeight,
            width: sizing.handleWidth,
            marginVertical: spacing.handleMarginVertical,
          },
          styleOverrides?.handle,
        ]}
      />
    );
  },
);

BottomSheetHandle.displayName = 'BottomSheetHandle';

const styles = StyleSheet.create({
  handle: {
    alignSelf: 'center',
  },
});
