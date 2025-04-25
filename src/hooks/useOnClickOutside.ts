import { RefObject, useEffect } from "react";

type Event = MouseEvent | TouchEvent | KeyboardEvent;

export const useOnClickOutside = <T extends HTMLElement = HTMLElement>(
  ref: RefObject<T>,
  handler: (event: Event) => void
) => {
  useEffect(() => {
    const listener = (event: Event) => {
      const el = ref?.current;
      if (!el || (event.target instanceof Node && el.contains(event.target))) {
        return;
      }

      // Check if the key pressed is the Escape key
      if (event instanceof KeyboardEvent && event.key === "Escape") {
        handler(event);
        return;
      }

      handler(event);
    };

    document.addEventListener("mousedown", listener);
    document.addEventListener("touchstart", listener);
    document.addEventListener("keydown", listener);

    return () => {
      document.removeEventListener("mousedown", listener);
      document.removeEventListener("touchstart", listener);
      document.removeEventListener("keydown", listener);
    };
  }, [ref, handler]);
};
