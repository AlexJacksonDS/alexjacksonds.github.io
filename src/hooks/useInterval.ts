import { useEffect, useRef } from "react";

export function useInterval(callback: () => void, delay: number) {
  const savedCallback = useRef<() => void>();

  useEffect(() => {
    savedCallback.current = callback;
  }, [callback]);

  useEffect(() => {
    function tick() {
      if (savedCallback.current) {
        savedCallback.current();
      }
    }

    if (delay) {
      let id = window.setInterval(tick, delay);
      return () => window.clearInterval(id);
    }
  });
}
