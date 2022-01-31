import { useEffect } from 'react';
import debounce from 'util/debounce';

export function useOnResize(cb) {
  const isWindowClient = typeof window === 'object';

  useEffect(() => {
    const handleResize = debounce(cb, 100);

    if (isWindowClient) {
      window.addEventListener('resize', handleResize);

      handleResize();

      return () => window.removeEventListener('resize', handleResize);
    }
  }, [isWindowClient]);
}
