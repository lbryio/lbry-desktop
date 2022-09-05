import { useState, useEffect } from 'react';
import { LocalStorage } from 'util/storage';

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

  if (key) {
    let item = LocalStorage.getItem(key);

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
    if (key) {
      LocalStorage.setItem(key, typeof value === 'object' ? JSON.stringify(value) : value);
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
  }, [key, value]);

  return [value, getSetAllValues(key, setValue)];
}
