"use client";

import { useRef, useSyncExternalStore } from "react";

export default function useLocalStorage<T>(key: string, initialValue: T) {
  //const cachedValue = useRef<T>(initialValue);

  const getSnapshot = () => {
    try {
      const item = localStorage.getItem(key);
      const value = item ? JSON.parse(item) : initialValue;

    //   if (JSON.stringify(cachedValue.current) !== JSON.stringify(value)) {
    //     cachedValue.current = value;
    //   }

      return value as T;
    } catch (error) {
      console.log(error);
      return initialValue;
    }
  };

  const subscribe = (listener: () => void) => {
    const handleStorageChange = (event: StorageEvent) => {
      if (event.key === key) {
        listener();
      }
    };

    window.addEventListener("storage", handleStorageChange);
    return () => window.removeEventListener("storage", handleStorageChange);
  };

  const setValue = (value: T) => {
    try {
      //const currentValue = cachedValue.current;
      //const newValue = value instanceof Function ? value(currentValue) : value;

      localStorage.setItem(key, JSON.stringify(value));
      //cachedValue.current = newValue;

      window.dispatchEvent(
        new StorageEvent("storage", {
          key,
          newValue: JSON.stringify(value),
        })
      );
    } catch (error) {
      console.log(error);
    }
  };

  const value = useSyncExternalStore(subscribe, getSnapshot, () => null);

  return [value, setValue] as const;
}
