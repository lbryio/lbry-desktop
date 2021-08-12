import { useEffect } from 'react';

export default function useHistoryNav(history) {
  useEffect(() => {
    const handleKeyPress = e => {
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
    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, []);
}
