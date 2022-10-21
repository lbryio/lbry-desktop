// @flow
import React from 'react';

type Options = {
  color?: string,
  disabled?: boolean,
};

/**
 * Hook to display debug info for the component's rendering process.
 *
 * - indicates mount/dismount actions.
 * - prints out the props that's causing the render.
 * - todo: indicates which state-change is causing the render.
 *
 * This hook is only meant for debugging purposes, so remember to remove the
 * usage before committing.
 *
 * @param props
 * @param label
 * @param options
 * @see https://stackoverflow.com/a/51082563/977819
 */
export default function useTraceRenders(props: any, label: string, options: Options = {}) {
  const { color, disabled } = options;
  const prev = React.useRef(props);

  function trace(msg) {
    if (!disabled) {
      const attributes = ['font-weight:bold', color ? `color:${color}` : ''];
      console.log(`%c${label}:`, attributes.join(';'), msg); // eslint-disable-line no-console
    }
  }

  React.useEffect(() => {
    const changedProps = Object.entries(props).reduce((ps, [k, v]) => {
      if (prev.current[k] !== v) {
        ps[k] = [prev.current[k], v];
      }
      return ps;
    }, {});

    if (Object.keys(changedProps).length > 0) {
      trace(changedProps);
    }
    prev.current = props;
  });

  React.useEffect(() => {
    trace('mounted');
    return () => trace('unmounted');
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
}
