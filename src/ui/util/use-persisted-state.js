import { useState, useEffect } from 'react';

export default function usePersistedState(key, firstTimeDefault) {
  // If no key is passed in, act as a normal `useState`
  let defaultValue;
  if (key) {
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

  useEffect(() => {
    if (key) {
      localStorage.setItem(key, typeof value === 'object' ? JSON.stringify(value) : value);
    }
  }, [key, value]);

  return [value, setValue];
}
