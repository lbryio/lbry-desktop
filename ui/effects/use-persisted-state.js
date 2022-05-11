import { useState, useEffect } from 'react';

const listeners = {};

function getSetAllValues(key, setValue) {
  if (!key) {
    // If no key just return the normal setValue function
    return setValue;
  }
  return (value) => listeners[key].forEach((fn) => fn(value));
}

export default function usePersistedState(key, firstTimeDefault) {
  // If no key is passed in, act as a normal `useState`
  let defaultValue;
  let localStorageAvailable;

  try {
    localStorageAvailable = Boolean(window.localStorage);
  } catch (e) {
    localStorageAvailable = false;
  }
  if (key && localStorageAvailable) {
    let item = localStorage.getItem(key);

    if (item) {
      let parsedItem;
      try {
        parsedItem = JSON.parse(item);
      } catch (e) {}

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
      localStorage.setItem(key, typeof value === 'object' ? JSON.stringify(value) : value);
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
