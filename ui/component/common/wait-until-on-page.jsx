// @flow
import React from 'react';
import debounce from 'util/debounce';

const DEBOUNCE_SCROLL_HANDLER_MS = 50;

type Props = {
  children: any,
  skipWait?: boolean,
  placeholder?: any,
};

export default function WaitUntilOnPage(props: Props) {
  const ref = React.useRef();
  const [shouldRender, setShouldRender] = React.useState(false);

  const shouldElementRender = React.useCallback((ref) => {
    const element = ref && ref.current;
    if (element) {
      const bounding = element.getBoundingClientRect();
      if (
        bounding.width > 0 &&
        bounding.height > 0 &&
        bounding.bottom >= 0 &&
        bounding.right >= 0 &&
        // $FlowFixMe
        bounding.top <= (window.innerHeight || document.documentElement.clientHeight) &&
        // $FlowFixMe
        bounding.left <= (window.innerWidth || document.documentElement.clientWidth)
      ) {
        return true;
      }
    }
    return false;
  }, []);

  // Handles "element is already in viewport when mounted".
  React.useEffect(() => {
    setTimeout(() => {
      if (!shouldRender && shouldElementRender(ref)) {
        setShouldRender(true);
      }
    }, 500);
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
      return () => window.removeEventListener('scroll', handleDisplayingRef);
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
