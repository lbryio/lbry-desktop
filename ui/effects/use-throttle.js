// @flow
import React from 'react';

const useEffectOnce = (effect) => {
  React.useEffect(effect, []);
};

function useUnmount(fn: () => any): void {
  const fnRef = React.useRef(fn);

  // update the ref each render so if it change the newest callback will be invoked
  fnRef.current = fn;

  useEffectOnce(() => () => fnRef.current());
}

export default function useThrottle(value: string, ms: number = 200) {
  const [state, setState] = React.useState(value);
  const timeout = React.useRef();
  const nextValue = React.useRef(null);
  const hasNextValue = React.useRef(0);

  React.useEffect(() => {
    if (!timeout.current) {
      setState(value);
      const timeoutCallback = () => {
        if (hasNextValue.current) {
          hasNextValue.current = false;
          setState(nextValue.current);
          timeout.current = setTimeout(timeoutCallback, ms);
        } else {
          timeout.current = undefined;
        }
      };
      timeout.current = setTimeout(timeoutCallback, ms);
    } else {
      nextValue.current = value;
      hasNextValue.current = true;
    }
  }, [ms, value]);

  useUnmount(() => {
    timeout.current && clearTimeout(timeout.current);
  });

  return state;
}
