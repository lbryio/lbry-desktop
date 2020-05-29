// @flow
import React from 'react';

type Props = {
  children: any,
};

export default function WaitUntilOnPage(props: Props) {
  const ref = React.useRef();
  const [shouldRender, setShouldRender] = React.useState(false);

  React.useEffect(() => {
    function handleDisplayingRef() {
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

        return () => {
          window.removeEventListener('scroll', handleDisplayingRef);
        };
      }
    }

    if (ref) {
      handleDisplayingRef();
    }
  }, [ref, setShouldRender, shouldRender]);

  return <div ref={ref}>{shouldRender && props.children}</div>;
}
