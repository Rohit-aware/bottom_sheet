export interface BottomSheetRef {
  
  open(): void;
  
  close(callback?: () => void): void;
  
  snapToIndex(index: number): void;
  
  expand(): void;
  
  collapse(): void;
}
