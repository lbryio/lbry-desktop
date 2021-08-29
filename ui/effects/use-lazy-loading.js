// @flow
import type { ElementRef } from 'react';
import React, { useEffect } from 'react';

/**
 * Helper React hook for lazy loading images
 * @param elementRef - A React useRef instance to the element to lazy load.
 * @param backgroundFallback
 * @param yOffsetPx - Number of pixels from the viewport to start loading.
 * @param {Array<>} [deps=[]] - The dependencies this lazy-load is reliant on.
 */
export default function useLazyLoading(
  elementRef: { current: ?ElementRef<any> },
  backgroundFallback: string = '',
  yOffsetPx: number = 500,
  deps: Array<any> = []
) {
  const [srcLoaded, setSrcLoaded] = React.useState(false);
  const threshold = 0.01;

  function calcRootMargin(value) {
    const devicePixelRatio = window.devicePixelRatio || 1.0;
    if (devicePixelRatio < 1.0) {
      return Math.ceil(value / devicePixelRatio);
    }
    return Math.ceil(value * devicePixelRatio);
  }

  useEffect(() => {
    if (!elementRef.current) {
      return;
    }

    const lazyLoadingObserver = new IntersectionObserver(
      (entries, observer) => {
        entries.forEach((entry) => {
          if (entry.intersectionRatio >= threshold) {
            const { target } = entry;

            observer.unobserve(target);

            // useful for lazy loading img tags
            if (target.dataset.src) {
              // $FlowFixMe
              target.src = target.dataset.src;
              setSrcLoaded(true);
              // No fallback handling here (clients have access to 'onerror' on the image ref).
              return;
            }

            // useful for lazy loading background images on divs
            if (target.dataset.backgroundImage) {
              if (backgroundFallback) {
                const tmpImage = new Image();
                tmpImage.onerror = () => {
                  target.style.backgroundImage = `url(${backgroundFallback})`;
                };
                tmpImage.src = target.dataset.backgroundImage;
              }
              target.style.backgroundImage = `url(${target.dataset.backgroundImage})`;
            }
          }
        });
      },
      {
        root: null,
        rootMargin: `0px 0px ${calcRootMargin(yOffsetPx)}px 0px`,
        threshold: [threshold],
      }
    );

    // $FlowFixMe
    lazyLoadingObserver.observe(elementRef.current);
  }, deps);

  return srcLoaded;
}
