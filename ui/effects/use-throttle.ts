import React from "react";

const useEffectOnce = (effect: unknown) => {
  // @ts-expect-error - TS2345 - Argument of type 'unknown' is not assignable to parameter of type 'EffectCallback'.
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
          // @ts-expect-error - TS2322 - Type 'boolean' is not assignable to type 'number'.
          hasNextValue.current = false;
          setState(nextValue.current);
          // @ts-expect-error - TS2322 - Type 'Timeout' is not assignable to type 'undefined'.
          timeout.current = setTimeout(timeoutCallback, ms);
        } else {
          timeout.current = undefined;
        }
      };
      // @ts-expect-error - TS2322 - Type 'Timeout' is not assignable to type 'undefined'.
      timeout.current = setTimeout(timeoutCallback, ms);
    } else {
      nextValue.current = value;
      // @ts-expect-error - TS2322 - Type 'boolean' is not assignable to type 'number'.
      hasNextValue.current = true;
    }
  }, [ms, value]);

  useUnmount(() => {
    timeout.current && clearTimeout(timeout.current);
  });

  return state;
}
