import { useEffect } from 'react';
import { Keyboard, KeyboardEvent, Platform } from 'react-native';
import { Easing, useSharedValue, withTiming } from 'react-native-reanimated';
import { useStableCallback } from './useStableCallback';

/**
 * Custom hook to track and animate the keyboard offset height.
 * Currently active on iOS only, mirroring original SDK behavior.
 */
export const useKeyboardBehavior = (visible: boolean) => {
  const keyboardOffset = useSharedValue(0);

  const animateKeyboardOffset = useStableCallback((offset: number) => {
    keyboardOffset.value = withTiming(offset, {
      duration: 250,
      easing: Easing.inOut(Easing.ease),
    });
  });

  const keyboardDidShow = useStableCallback((event: KeyboardEvent) => {
    animateKeyboardOffset(event.endCoordinates.height);
  });

  const keyboardDidHide = useStableCallback(() => {
    animateKeyboardOffset(0);
  });

  useEffect(() => {
    if (!visible) {
      keyboardOffset.value = 0;
      return;
    }

    const listeners: any[] = [];

    const showEvent = Platform.OS === 'ios' ? 'keyboardWillShow' : 'keyboardDidShow';
    const hideEvent = Platform.OS === 'ios' ? 'keyboardWillHide' : 'keyboardDidHide';

    listeners.push(
      Keyboard.addListener(showEvent, keyboardDidShow),
      Keyboard.addListener(hideEvent, keyboardDidHide),
    );

    return () => {
      listeners.forEach((l) => l.remove());
    };
  }, [visible, keyboardDidShow, keyboardDidHide, keyboardOffset]);

  return keyboardOffset;
};
