// Widths are taken from "ui/scss/init/vars.scss"
import React from 'react';

export function useWindowSize(fn) {
  const isWindowClient = typeof window === 'object';
  const initialState = fn ? fn(window.innerWidth) : window.innerWidth;
  const [windowSize, setWindowSize] = React.useState(isWindowClient ? initialState : undefined);

  React.useEffect(() => {
    function setSize() {
      if (fn) {
        const curr = fn(window.innerWidth);
        if (windowSize !== curr) setWindowSize(curr);
      } else setWindowSize(window.innerWidth);
    }

    if (isWindowClient) {
      window.addEventListener('resize', setSize);

      setSize();

      return () => window.removeEventListener('resize', setSize);
    }
  }, [isWindowClient, setWindowSize]);

  return windowSize;
}

export function useIsMobile() {
  return useWindowSize((windowSize) => windowSize < 901);
}

export function useIsMediumScreen() {
  return useWindowSize((windowSize) => windowSize < 1151);
}

export function useIsLargeScreen() {
  return useWindowSize((windowSize) => windowSize > 1600);
}
