// @flow
import React from 'react';
import debounce from 'util/debounce';

const DEBOUNCE_SCROLL_HANDLER_MS = 50;

function scaleToDevicePixelRatio(value) {
  const devicePixelRatio = window.devicePixelRatio || 1.0;
  if (devicePixelRatio < 1.0) {
    return Math.ceil(value / devicePixelRatio);
  }
  return Math.ceil(value * devicePixelRatio);
}

type Props = {
  children: any,
  skipWait?: boolean,
  placeholder?: any,
  yOffset?: number,
};

export default function WaitUntilOnPage(props: Props) {
  const { yOffset } = props;
  const ref = React.useRef();
  const [shouldRender, setShouldRender] = React.useState(false);

  const shouldElementRender = React.useCallback(
    (ref) => {
      const element = ref && ref.current;
      if (element) {
        const bounding = element.getBoundingClientRect();
        // $FlowFixMe
        const windowH = window.innerHeight || document.documentElement.clientHeight;
        // $FlowFixMe
        const windowW = window.innerWidth || document.documentElement.clientWidth;

        const isApproachingViewport = yOffset && bounding.top < windowH + scaleToDevicePixelRatio(yOffset);
        const isInViewport = // also covers "element is larger than viewport".
          bounding.width > 0 &&
          bounding.height > 0 &&
          bounding.bottom >= 0 &&
          bounding.right >= 0 &&
          bounding.top <= windowH &&
          bounding.left <= windowW;

        return isInViewport || isApproachingViewport;
      }

      return false;
    },
    [yOffset]
  );

  // Handles "element is already in viewport when mounted".
  React.useEffect(() => {
    const timer = setTimeout(() => {
      if (!shouldRender && shouldElementRender(ref)) {
        setShouldRender(true);
      }
    }, 500);

    return () => clearTimeout(timer);
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  // Handles "element scrolled into viewport".
  React.useEffect(() => {
    const handleDisplayingRef = debounce(() => {
      if (shouldElementRender(ref)) {
        setShouldRender(true);
      }
    }, DEBOUNCE_SCROLL_HANDLER_MS);

    if (ref && ref.current && !shouldRender) {
      window.addEventListener('scroll', handleDisplayingRef);
      window.addEventListener('resize', handleDisplayingRef);
      return () => {
        window.removeEventListener('scroll', handleDisplayingRef);
        window.removeEventListener('resize', handleDisplayingRef);
      };
    }
  }, [ref, setShouldRender, shouldRender, shouldElementRender]);

  const render = props.skipWait || shouldRender;

  return (
    <div ref={ref}>
      {render && props.children}
      {!render && props.placeholder !== undefined && props.placeholder}
    </div>
  );
}
