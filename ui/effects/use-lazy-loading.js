// @flow
import type { ElementRef } from 'react';
import { useEffect } from 'react';

/**
 * Helper React hook for lazy loading images
 * @param elementRef - A React useRef instance to the element to lazy load.
 * @param {Number} [threshold=0.5] - The percent visible in order for loading to begin.
 * @param {Array<>} [deps=[]] - The dependencies this lazy-load is reliant on.
 */
export default function useLazyLoading(
  elementRef: { current: ?ElementRef<any> },
  threshold: number = 0.25,
  deps: Array<any> = []
) {
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
              return;
            }

            // useful for lazy loading background images on divs
            if (target.dataset.backgroundImage) {
              target.style.backgroundImage = `url(${target.dataset.backgroundImage})`;
            }
          }
        });
      },
      {
        root: null,
        rootMargin: '0px',
        threshold,
      }
    );

    lazyLoadingObserver.observe(elementRef.current);
  }, deps);
}
