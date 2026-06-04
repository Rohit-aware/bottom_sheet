# 🚀 @rn-lab/bottom-sheet

A premium, highly-optimized, framework-agnostic bottom sheet component for **React Native**, built on top of **React Native Reanimated v3** and **Gesture Handler v2**.

[![npm version](https://img.shields.io/badge/npm-v1.0.0-blue.svg?style=flat-square)](https://www.npmjs.com/)
[![platform](https://img.shields.io/badge/platform-ios%20%7C%20android-lightgrey.svg?style=flat-square)](#)
[![license](https://img.shields.io/badge/license-MIT-green.svg?style=flat-square)](LICENSE)
[![sideeffects](https://img.shields.io/badge/sideeffects-false-brightgreen.svg?style=flat-square)](#)
[![size](https://img.shields.io/badge/size-%3C20%20KB-blueviolet.svg?style=flat-square)](#)

---

## ✨ Key Features & Performance Advantages

Why choose `@rn-lab/bottom-sheet` over `@gorhom/bottom-sheet` or other alternatives?

* ⚡ **Zero-Jank / 60+ FPS**: Built natively with Reanimated v3 shared values. Animations run completely on the UI thread, bypassing the React Native bridge during active gestures.
* 📦 **Ultra-Lightweight & Tree-Shakeable**: Configured with `sideEffects: false` and strict module exports. It has a tiny footprint and tree-shakes unused components (like backdrops/handles) cleanly.
* 🔒 **Solid Public API Stability**: Features a secure `exports` conditional map. Internal hooks (such as layout computations, state machinery, gestures) are fully encapsulated and hidden. Refactors never leak or break your application.
* 🎨 **Integrated Theme Engine**: Comes with a fully reactive design system (`BottomSheetThemeProvider` + `useResolvedTheme`) for out-of-the-box Dark/Light mode transitions with zero-overhead memoization.
* ⌨️ **Keyboard Aware**: Smoothly offsets in response to system keyboards, adjusting height boundaries dynamically.

---

## 📦 Installation

Install the package via your favorite package manager:

```bash
# Using bun (recommended)
bun add @rn-lab/bottom-sheet

# Using npm
npm install @rn-lab/bottom-sheet
```

### Peer Dependencies
Ensure you have the following packages installed in your project:

```json
"peerDependencies": {
  "react": ">=18.0.0",
  "react-native": ">=0.73.0",
  "react-native-gesture-handler": ">=2.18.0",
  "react-native-reanimated": ">=3.16.0",
  "react-native-safe-area-context": ">=5.0.0",
  "react-native-worklets": ">=1.0.0"
}
```

---

## 🚀 Quick Usage Example

Here is a clean, modern implementation demonstrating backdrop dimming, dynamic snap points, and imperative ref control:

```tsx
import React, { useRef, useState, useCallback } from 'react';
import { View, Text, StyleSheet, Button } from 'react-native';
import { 
  BottomSheet, 
  BottomSheetRef, 
  BottomSheetBackdrop 
} from '@rn-lab/bottom-sheet';

export default function App() {
  const [visible, setVisible] = useState(false);
  const bottomSheetRef = useRef<BottomSheetRef>(null);

  const openSheet = () => setVisible(true);
  const closeSheet = () => bottomSheetRef.current?.close();

  // Reference-stable backdrop rendering callback
  const renderBackdrop = useCallback(
    (props: any) => <BottomSheetBackdrop {...props} />,
    []
  );

  return (
    <View style={styles.container}>
      <Button title="Open Bottom Sheet" onPress={openSheet} />

      <BottomSheet
        ref={bottomSheetRef}
        visible={visible}
        snapPoints={['30%', '60%', '90%']}
        onClose={() => setVisible(false)}
        renderBackdrop={renderBackdrop}
        lazy={true} // Defers children rendering until animation completes
      >
        <View style={styles.content}>
          <Text style={styles.title}>Welcome to @rn-lab/bottom-sheet 🎉</Text>
          <Text style={styles.text}>Drag me or click buttons to snap!</Text>
          <Button title="Snap to 90%" onPress={() => bottomSheetRef.current?.snapToIndex(2)} />
          <Button title="Close Sheet" onPress={closeSheet} />
        </View>
      </BottomSheet>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f5f5f5',
  },
  content: {
    padding: 24,
    alignItems: 'center',
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  text: {
    fontSize: 14,
    color: '#666',
    marginBottom: 24,
  },
});
```

---

## 🛠️ Performance Guidelines & Best Practices

To maintain 60/120 FPS animations, adhere to the following library guidelines:

> [!IMPORTANT]
> **Avoid Inline Objects in Props**: Do not pass inline objects or arrow functions directly into style or backdrop overrides. Use `useMemo` or `useCallback` to prevent breaking `React.memo` structures.

> [!TIP]
> **Use the `lazy` Prop for Heavy Views**: If your bottom sheet contains charts, maps, or heavy lists, enable `lazy={true}`. This defers the expensive React rendering of children until the open animation has fully completed.

> [!WARNING]
> **Do Not Trigger React State Updates in Animation Hooks**: Avoid calling `setState` inside gesture worklets. If you need coordination, use Reanimated's `useDerivedValue` which executes completely on the UI thread without crossing the React Native bridge.

---

## 📖 API Reference

### BottomSheet Props

| Prop | Type | Default | Description |
|---|---|---|---|
| `visible` | `boolean` | `required` | Controls the visibility state of the sheet. |
| `snapPoints` | `SnapPoint[]` | `required` | Height values. Accepts numbers (px) or percentages (e.g. `'50%'`). |
| `onClose` | `() => void` | `required` | Callback fired when the sheet completes its close animation. |
| `initialSnapIndex` | `number` | `0` | Snap index to focus on when opening. |
| `lazy` | `boolean` | `false` | When true, delays children mounting until sheet is opened. |
| `enableDynamicSizing` | `boolean` | `false` | Caps the lowest snap point height exactly to the sheet's content layout. |
| `enableDragToClose` | `boolean` | `true` | Enables gesture swiping downward to dismiss the sheet. |
| `enableBackdropDismiss`| `boolean` | `true` | Allows dismissing the sheet by tapping the backdrop area. |
| `renderBackdrop` | `(props) => ReactNode` | `undefined` | Custom renderer to display a background dimming/blur overlay. |
| `renderHandle` | `(props) => ReactNode` | `undefined` | Custom renderer for the top drag indicator handle. |
| `theme` | `Partial<BottomSheetTheme>` | `undefined` | Style overrides for colors, radii, sizing, and spacing variables. |
| `avoidKeyboard` | `boolean` | `false` | Automatically wraps the layout in a KeyboardAvoidingView. |

### Imperative Methods (`BottomSheetRef`)

*   `open()`: Displays the sheet and snaps to `initialSnapIndex`.
*   `close(callback?: () => void)`: Slides the sheet down and triggers closing callbacks.
*   `snapToIndex(index: number)`: Animates translation to a specific snap point.
*   `expand()`: Snaps to the highest index.
*   `collapse()`: Snaps to the lowest index (index 0).

---

## 📄 License

MIT © [RN Lab](https://github.com/)
