// @flow
import React, { useState, useCallback } from 'react';
import * as ICONS from 'constants/icons';
import Button from 'component/button';

// the maximum length of history to show per button
const MAX_HISTORY_SIZE = 12;

type Props = {
  isBackward: boolean,
  history: {
    entries: { key: string, title: string }[],
    go: number => void,
    goBack: () => void,
    goForward: () => void,
    index: number,
    length: number,
    location: { pathname: string },
    push: string => void,
  },
};

// determines which slice of entries should make up the back or forward button drop-downs (isBackward vs !isBackward respectively)
const sliceEntries = (currentIndex, entries, historyLength, isBackward, maxSize) => {
  let l = isBackward ? 0 : currentIndex + 1;
  let r = isBackward ? currentIndex : historyLength;
  const exceedsMax = maxSize < r - l;
  if (!exceedsMax) {
    return entries.slice(l, r);
  } else if (isBackward) {
    l = r - maxSize;
  } else {
    r = l + maxSize;
  }
  return entries.slice(l, r);
};

const NavigationButton = (props: Props) => {
  const { isBackward, history } = props;
  const { entries, go } = history;
  const currentIndex = history.index;
  const historyLength = history.length;
  const [showHistory, setShowHistory] = useState(false);

  // creates an <li> intended for the button's <ul>
  const makeItem = useCallback(
    (entry, index) => {
      // difference between the current index and the index of the entry
      const backwardDif = index - (currentIndex < MAX_HISTORY_SIZE ? currentIndex : MAX_HISTORY_SIZE);
      const forwardDif = index + 1;
      return (
        <li
          key={entry.key}
          onMouseDown={() => {
            setShowHistory(false);
            go(isBackward ? backwardDif : forwardDif);
          }}
        >
          {entry.title}
        </li>
      );
    },
    [currentIndex, isBackward, go]
  );
  const slicedEntries = sliceEntries(currentIndex, entries, historyLength, isBackward, MAX_HISTORY_SIZE);
  return (
    <div>
      <Button
        className={`header__navigation-item header__navigation-item--${isBackward ? 'back' : 'forward'}`}
        description={isBackward ? __('Navigate back') : __('Navigate forward')}
        onBlur={() => setShowHistory(false)}
        onClick={() => (isBackward ? history.goBack() : history.goForward())}
        onContextMenu={e => {
          setShowHistory(!showHistory);
          // the following three lines prevent the regular context menu (right click menu) from appearing
          e.preventDefault();
          e.stopPropagation();
          return false;
        }}
        icon={isBackward ? ICONS.ARROW_LEFT : ICONS.ARROW_RIGHT}
        iconSize={18}
        disabled={slicedEntries.length === 0}
      />
      {showHistory && <ul className={'header__navigaiton-dropdown'}>{slicedEntries.map(makeItem)}</ul>}
    </div>
  );
};
export default NavigationButton;
