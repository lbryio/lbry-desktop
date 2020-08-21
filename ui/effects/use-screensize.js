// Widths are taken from "ui/scss/init/vars.scss"
import React from 'react';

function useWindowSize() {
  const isWindowClient = typeof window === 'object';
  const [windowSize, setWindowSize] = React.useState(isWindowClient ? window.innerWidth : undefined);

  React.useEffect(() => {
    function setSize() {
      setWindowSize(window.innerWidth);
    }

    if (isWindowClient) {
      window.addEventListener('resize', setSize);

      return () => window.removeEventListener('resize', setSize);
    }
  }, [isWindowClient, setWindowSize]);

  return windowSize;
}

export function useIsMobile() {
  const windowSize = useWindowSize();
  return windowSize < 901;
}

export function useIsMediumScreen() {
  const windowSize = useWindowSize();
  return windowSize < 1151;
}

export function useIsLargeScreen() {
  const windowSize = useWindowSize();
  return windowSize > 1600;
}
