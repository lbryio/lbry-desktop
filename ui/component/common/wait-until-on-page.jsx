// @flow
import React from 'react';
import debounce from 'util/debounce';

const DEBOUNCE_SCROLL_HANDLER_MS = 300;

type Props = {
  children: any,
  lastUpdateDate?: any,
  skipWait?: boolean,
  placeholder?: any,
};

export default function WaitUntilOnPage(props: Props) {
  const ref = React.useRef();
  const [shouldRender, setShouldRender] = React.useState(false);

  React.useEffect(() => {
    setShouldRender(false);
  }, [props.lastUpdateDate]);

  React.useEffect(() => {
    const handleDisplayingRef = debounce((e) => {
      const element = ref && ref.current;
      if (element) {
        const bounding = element.getBoundingClientRect();
        if (
          bounding.bottom >= 0 &&
          bounding.right >= 0 &&
          // $FlowFixMe
          bounding.top <= (window.innerHeight || document.documentElement.clientHeight) &&
          // $FlowFixMe
          bounding.left <= (window.innerWidth || document.documentElement.clientWidth)
        ) {
          setShouldRender(true);
        }
      }

      if (element && !shouldRender) {
        window.addEventListener('scroll', handleDisplayingRef);
        return () => window.removeEventListener('scroll', handleDisplayingRef);
      }
    }, DEBOUNCE_SCROLL_HANDLER_MS);

    if (ref) {
      handleDisplayingRef();
    }
  }, [ref, setShouldRender, shouldRender]);

  const render = props.skipWait || shouldRender;

  return (
    <div ref={ref}>
      {render && props.children}
      {!render && props.placeholder !== undefined && props.placeholder}
    </div>
  );
}
