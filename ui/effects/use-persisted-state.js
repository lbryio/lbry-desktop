import { useState } from 'react';

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

  function setValueAndLocalStorage(newValue) {
    if (key && localStorageAvailable && value !== newValue) {
      localStorage.setItem(key, typeof newValue === 'object' ? JSON.stringify(newValue) : newValue);
    }

    setValue(newValue);
  }

  return [value, setValueAndLocalStorage];
}
