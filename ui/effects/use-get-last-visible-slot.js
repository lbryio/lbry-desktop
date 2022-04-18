// @flow
import React from 'react';

/**
 * Returns the last visible slot in a list.
 *
 * @param listRef A reference to the list.
 * @param skipEval Skip the evaluation/effect. Useful if the client knows the effect is not needed in certain scenarios.
 * @param checkDelayMs Delay before running the effect. Useful if the list is known to not be populated until later.
 * @returns {number | undefined} Zero-indexed number representing the last visible slot.
 */
export default function useGetLastVisibleSlot(listRef: any, skipEval: boolean, checkDelayMs: number = 1500) {
  const [lastVisibleIndex, setLastVisibleIndex] = React.useState(undefined);

  React.useEffect(() => {
    if (!skipEval) {
      const timer = setTimeout(() => {
        if (listRef.current) {
          const screenBottom = window.innerHeight;
          const items = listRef.current.children;

          if (items.length) {
            let i = 2; // Start from 2, so that the min possible is index-1
            for (; i < items.length; ++i) {
              const rect = items[i].getBoundingClientRect();
              if (rect.top > screenBottom || rect.bottom > screenBottom) {
                break;
              }
            }

            setLastVisibleIndex(i - 1);
            return;
          }
        }

        // Fallback to index-1 (2nd item) for failures. No retries.
        setLastVisibleIndex(1);
      }, checkDelayMs);

      return () => clearTimeout(timer);
    }
  }, []);

  return lastVisibleIndex;
}
