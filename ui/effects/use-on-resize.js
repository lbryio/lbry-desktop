import { useEffect } from 'react';
import debounce from 'util/debounce';

export function useOnResize(cb) {
  useEffect(() => {
    const handleResize = debounce(cb, 100);

    window.addEventListener('resize', handleResize);

    handleResize();

    return () => window.removeEventListener('resize', handleResize);
  }, []);
}
