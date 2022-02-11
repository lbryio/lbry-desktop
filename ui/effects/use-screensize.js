// @flow
// Widths are taken from "ui/scss/init/vars.scss"
import React, { useRef } from 'react';
const DEFAULT_SCREEN_SIZE = 1080;

export function useWindowSize() {
  const isWindowClient = typeof window === 'object';
  const [windowSize, setWindowSize] = React.useState(isWindowClient ? window.innerWidth : DEFAULT_SCREEN_SIZE);

  React.useEffect(() => {
    function setSize() {
      setWindowSize(window.innerWidth);
    }

    if (isWindowClient) {
      window.addEventListener('resize', setSize);

      return () => window.removeEventListener('resize', setSize);
    }
  }, [isWindowClient]);

  return windowSize;
}

function useHasWindowWidthChangedEnough(comparisonFn: (windowSize: number) => boolean) {
  const isWindowClient = typeof window === 'object';
  const initialState = isWindowClient ? comparisonFn(window.innerWidth) : comparisonFn(DEFAULT_SCREEN_SIZE);
  const [windowSize, setWindowSize] = React.useState(initialState);
  const prev = useRef(window.innerWidth);

  React.useEffect(() => {
    function setSize() {
      const curr = comparisonFn(window.innerWidth);
      if (prev !== curr) {
        setWindowSize(curr);
        prev.current = curr;
      }
    }

    if (isWindowClient) {
      window.addEventListener('resize', setSize);

      return () => window.removeEventListener('resize', setSize);
    }
  }, [isWindowClient]);

  return windowSize;
}

export function useIsMobile() {
  return useHasWindowWidthChangedEnough((windowSize) => windowSize < 901);
}

export function useIsMediumScreen() {
  return useHasWindowWidthChangedEnough((windowSize) => windowSize < 1151);
}

export function useIsLargeScreen() {
  return useHasWindowWidthChangedEnough((windowSize) => windowSize > 1600);
}

export function isTouch() {
  return 'ontouchstart' in window || 'onmsgesturechange' in window;
}
