// @flow
import React from 'react';
import debounce from 'util/debounce';

const DEBOUNCE_SCROLL_HANDLER_MS = 300;

type Props = {
  children: any,
  lastUpdateDate?: any,
  skipWait?: boolean,
};

export default function WaitUntilOnPage(props: Props) {
  const ref = React.useRef();
  const [shouldRender, setShouldRender] = React.useState(false);

  React.useEffect(() => {
    setShouldRender(false);
  }, [props.lastUpdateDate]);

  React.useEffect(() => {
    const handleDisplayingRef = debounce(e => {
      const element = ref && ref.current;
      if (element) {
        const bounding = element.getBoundingClientRect();
        if (
          bounding.top >= 0 &&
          bounding.left >= 0 &&
          // $FlowFixMe
          bounding.right <= (window.innerWidth || document.documentElement.clientWidth) &&
          // $FlowFixMe
          bounding.bottom <= (window.innerHeight || document.documentElement.clientHeight)
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

  return <div ref={ref}>{(props.skipWait || shouldRender) && props.children}</div>;
}
