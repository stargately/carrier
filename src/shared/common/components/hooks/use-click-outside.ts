import { MutableRefObject, useEffect } from "react";

/**
 * click swatch picker outside to close it.
 *
 * @param ref MutableRefObject<any>
 * @param handler (event: MouseEvent) => void
 */
export const useClickOutside = (
  ref: MutableRefObject<any>,
  handler: (e: MouseEvent) => void
): void => {
  useEffect(() => {
    let startedInside = false;
    let startedWhenMounted = false;

    const listener = (event: MouseEvent) => {
      // Do nothing if `mousedown` or `touchstart` started inside ref element
      if (startedInside || !startedWhenMounted) {
        return;
      }
      // Do nothing if clicking ref's element or descendent elements
      if (!ref.current || ref.current.contains(event.target)) {
        return;
      }

      handler(event);
    };

    const validateEventStart = (event: TouchEvent | MouseEvent) => {
      startedWhenMounted = ref.current;
      startedInside = ref.current && ref.current.contains(event.target);
    };

    document.addEventListener("mousedown", validateEventStart);
    document.addEventListener("touchstart", validateEventStart);
    document.addEventListener("click", listener);

    return () => {
      document.removeEventListener("mousedown", validateEventStart);
      document.removeEventListener("touchstart", validateEventStart);
      document.removeEventListener("click", listener);
    };
  }, [ref, handler]);
};
