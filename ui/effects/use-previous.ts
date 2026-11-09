//@ts-nocheck
import {useEffect, useRef} from 'react';

export default function usePrevious(value: unknown) {
  const ref = useRef();

  useEffect(() => {
    ref.current = value;
  }, [value]);

  return ref.current;
}
