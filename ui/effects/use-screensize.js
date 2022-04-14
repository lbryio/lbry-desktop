// @flow
// Widths are taken from "ui/scss/init/vars.scss"
import React, { useRef } from 'react';
import { getWindowAngle, isWindowLandscapeForAngle } from 'component/fileRenderFloating/helper-functions';
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
  const initialState: boolean = isWindowClient ? comparisonFn(window.innerWidth) : comparisonFn(DEFAULT_SCREEN_SIZE);
  const [windowSize, setWindowSize] = React.useState<boolean>(initialState);
  const prev = useRef<boolean>(initialState);

  React.useEffect(() => {
    function setSize() {
      const curr = comparisonFn(window.innerWidth);
      if (prev.current !== curr) {
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

export function useIsMobileLandscape() {
  const isMobile = useIsMobile();
  const isLandscapeScreen = useIsLandscapeScreen();
  return isMobile && isLandscapeScreen;
}

export function useIsLandscapeScreen() {
  const isWindowClient = typeof window === 'object';

  const windowAngle = getWindowAngle();
  const isLandscape = isWindowLandscapeForAngle(windowAngle);
  const [landscape, setLandscape] = React.useState<boolean>(isLandscape);

  React.useEffect(() => {
    function handleResize() {
      const currAngle = getWindowAngle();
      const isCurrLandscape = isWindowLandscapeForAngle(currAngle);
      if (landscape !== isCurrLandscape) {
        setLandscape(isCurrLandscape);
      }
    }

    if (isWindowClient) {
      window.addEventListener('resize', handleResize);

      return () => window.removeEventListener('resize', handleResize);
    }
  }, [isWindowClient, landscape]);

  return landscape;
}

export function useIsMediumScreen() {
  return useHasWindowWidthChangedEnough((windowSize) => windowSize < 1151);
}

export function useIsLargeScreen() {
  return useHasWindowWidthChangedEnough((windowSize) => windowSize > 1600);
}
