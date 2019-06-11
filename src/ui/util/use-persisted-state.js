import { useState, useEffect } from 'react';

export default function usePersistedState(key, firstTimeDefault) {
  // If no key is passed in, act as a normal `useState`
  let defaultValue;
  if (key) {
    defaultValue = localStorage.getItem(key);
  }

  if (!defaultValue) {
    defaultValue = firstTimeDefault;
  }

  const [value, setValue] = useState(defaultValue);

  useEffect(() => {
    if (key) {
      localStorage.setItem(key, value);
    }
  }, [key, value]);

  return [value, setValue];
}
