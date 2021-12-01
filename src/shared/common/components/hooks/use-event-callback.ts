import { useRef } from "react";

/**
 * Avoid "useCallback hell".
 */
export function useEventCallback<T>(
  handler?: (value: T) => void
): (value: T) => void {
  const ref = useRef(handler);

  const fn = useRef((value: T) => {
    ref.current && ref.current(value);
  });
  ref.current = handler;

  return fn.current;
}
