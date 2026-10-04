import { time } from "console";
import React, { useCallback, useEffect, useRef } from "react";

export function useDebouncedCallback<Args extends unknown[]>(
  callback: (...args: Args) => void,
  delay = 400,
) {
  const timer = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);
  const latestCallback = useRef(callback);

  useEffect(() => {
    latestCallback.current = callback;
  });
  useEffect(() => () => clearTimeout(timer.current), []);

  return useCallback(
    (...args: Args) => {
      clearTimeout(timer.current);
      timer.current = setTimeout(() => latestCallback.current(...args), delay);
    },
    [delay],
  );
}
