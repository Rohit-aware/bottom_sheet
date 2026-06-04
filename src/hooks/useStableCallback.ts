import { useCallback, useRef } from 'react';

export type StableCallback<A extends unknown[], R> = (...args: A) => R;

/**
 * A hook that returns a stable callback reference, avoiding child re-renders
 * while always executing the latest version of the passed callback function.
 */
export const useStableCallback = <A extends unknown[], R>(
  callback: StableCallback<A, R>,
): StableCallback<A, R> => {
  const ref = useRef(callback);
  ref.current = callback;

  return useCallback<StableCallback<A, R>>((...args) => {
    return ref.current(...args);
  }, []);
};
