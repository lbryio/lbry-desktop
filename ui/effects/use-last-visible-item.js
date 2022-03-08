// @flow
import React from 'react';
import type { Node } from 'react';

type InjectedItem = { node: Node, index?: number, replace?: boolean };

/**
 * Returns the index indicating where in the claim-grid to inject the ad element
 * @param injectedItem
 * @param listRef - A reference to the claim-grid
 * @returns {number}
 */
export default function useLastVisibleItem(injectedItem: ?InjectedItem, listRef: any) {
  const [injectedIndex, setInjectedIndex] = React.useState(injectedItem?.index);

  React.useEffect(() => {
    // Move to default injection index (last visible item)
    if (injectedItem && injectedItem.index === undefined) {
      // AD_INJECTION_DELAY_MS = average total-blocking-time incurred for
      // loading ads. Delay to let higher priority tasks run first. Ideally,
      // should use 'requestIdleCallback/requestAnimationFrame'.
      const AD_INJECTION_DELAY_MS = 1500;

      const timer = setTimeout(() => {
        if (listRef.current) {
          const screenBottom = window.innerHeight;

          // claim preview tiles
          const items = listRef.current.children;

          // algo to return index of item, where ad will be injected before it
          if (items.length) {
            let i = 2; // Start from 2, so that the min possible is index-1
            for (; i < items.length; ++i) {
              const rect = items[i].getBoundingClientRect();
              if (rect.top > screenBottom || rect.bottom > screenBottom) {
                break;
              }
            }

            setInjectedIndex(i - 1);
            return;
          }
        }

        // Fallback to index-1 (2nd item) for failures. No retries.
        setInjectedIndex(1);
      }, AD_INJECTION_DELAY_MS);

      return () => clearTimeout(timer);
    }
  }, []);

  return injectedIndex;
}
