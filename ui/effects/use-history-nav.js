import { useEffect } from 'react';
import { useActiveElement } from './use-active-element';
export default function useHistoryNav(history) {
  const el = useActiveElement(); // disable if we're in a textarea.
  useEffect(() => {
    const handleKeyPress = (e) => {
      if ((e.metaKey || e.altKey) && !e.ctrlKey && !e.shiftKey) {
        switch (e.code) {
          case 'ArrowLeft':
            e.preventDefault();
            history.goBack();
            break;
          case 'ArrowRight':
            e.preventDefault();
            history.goForward();
            break;
          default:
            // Do nothing
            break;
        }
      }
    };
    if (!el.type || (el.type && !el.type.startsWith('text'))) {
      window.addEventListener('keydown', handleKeyPress);
    }
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [el]);
}
