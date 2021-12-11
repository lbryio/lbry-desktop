import { useEffect } from 'react';
import { changeZoomFactor, ZOOM } from 'util/zoomWindow';

export default function useHover(ref) {
  useEffect(() => {
    const handleKeyPress = e => {
      if (e.ctrlKey && !e.shiftKey) {
        switch (e.code) {
          case 'NumpadAdd':
          case 'Equal':
            e.preventDefault();
            changeZoomFactor(ZOOM.INCREMENT);
            break;
          case 'NumpadSubtract':
          case 'Minus':
            e.preventDefault();
            changeZoomFactor(ZOOM.DECREMENT);
            break;
          case 'Numpad0':
          case 'Digit0':
            e.preventDefault();
            changeZoomFactor(ZOOM.RESET);
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

  useEffect(() => {
    const handleWheel = e => {
      if (e.ctrlKey && !e.shiftKey) {
        if (e.deltaY < 0) {
          changeZoomFactor(ZOOM.INCREMENT);
        } else {
          changeZoomFactor(ZOOM.DECREMENT);
        }
      }
    };
    window.addEventListener('wheel', handleWheel);
    return () => window.removeEventListener('wheel', handleWheel);
  }, []);

  useEffect(() => {
    changeZoomFactor(ZOOM.LOAD_FROM_LOCAL_STORAGE);
  }, []);
}
