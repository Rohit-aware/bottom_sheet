export interface BottomSheetRef {
  /**
   * Opens the bottom sheet.
   */
  open(): void;
  /**
   * Closes the bottom sheet, with an optional callback that runs when the close animation completes.
   */
  close(callback?: () => void): void;
  /**
   * Snaps the bottom sheet to a specific index in the resolved snapPoints array.
   */
  snapToIndex(index: number): void;
  /**
   * Snaps the bottom sheet to its highest snap point.
   */
  expand(): void;
  /**
   * Snaps the bottom sheet to its lowest (first) snap point.
   */
  collapse(): void;
}
