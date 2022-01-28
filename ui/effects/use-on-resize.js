import { useEffect } from 'react';

export function useOnResize(cb) {
  useEffect(() => {
    function handleResize() {
      cb();
    }

    window.addEventListener('resize', handleResize);

    handleResize();

    return () => window.removeEventListener('resize', handleResize);
  }, [cb]);
}
