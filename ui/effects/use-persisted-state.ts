//@ts-nocheck
import { useState, useEffect } from "react";

const listeners: Record<string, any> = {};

function getSetAllValues(key: unknown, setValue: unknown) {
  if (!key) {
    // If no key just return the normal setValue function
    return setValue;
  }
  return (value: unknown) => listeners[key].forEach((fn) => fn(value));
}

export default function usePersistedState(key: unknown, firstTimeDefault: unknown) {
  // If no key is passed in, act as a normal `useState`
  let defaultValue;
  let localStorageAvailable;

  try {
    localStorageAvailable = Boolean(window.localStorage);
  } catch (e: any) {
    localStorageAvailable = false;
  }
  if (key && localStorageAvailable) {
    const item = localStorage.getItem(key);

    if (item) {
      let parsedItem;
      try {
        parsedItem = JSON.parse(item);
      } catch (e: any) {}

      if (parsedItem !== undefined) {
        defaultValue = parsedItem;
      } else {
        defaultValue = item;
      }
    }
  }

  if (!defaultValue && defaultValue !== false) {
    defaultValue = firstTimeDefault;
  }

  const [value, setValue] = useState(defaultValue);

  if (key && !Array.isArray(listeners[key])) {
    listeners[key] = [];
  }

  useEffect(() => {
    if (key && localStorageAvailable) {
      localStorage.setItem(key, typeof value === "object" ? JSON.stringify(value) : value);
    }
    if (key) {
      // add hook on mount
      listeners[key].push(setValue);
    }
    return () => {
      if (key) {
        // remove hook on unmount
        listeners[key] = listeners[key].filter((listener) => listener !== setValue);
      }
    };
  }, [key, value, localStorageAvailable]);

  return [value, getSetAllValues(key, setValue)];
}
