// @flow
import React, { useState, useCallback } from 'react';
import * as ICONS from 'constants/icons';
import Button from 'component/button';

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

const ButtonNavigation = (props: Props) => {
  const { isBackward, history } = props;
  const [showHistory, setShowHistory] = useState(false);

  const makeItem = useCallback(
    (entry, index) => {
      const goArg = index - history.index;
      console.log(`index: ${index}, currentIndex: ${history.index}, goArg: ${goArg}, title: ${entry.title}`);
      return (
        <li
          key={entry.key}
          onClick={() => {
            setShowHistory(!showHistory);
            history.go(goArg);
          }}
        >
          {entry.title}
        </li>
      );
    },
    [history, showHistory]
  );

  return (
    <div>
      <Button
        className="header__navigation-item header__navigation-item--back"
        description={__('Navigate back')}
        onClick={() => history.goBack()}
        onContextMenu={e => {
          setShowHistory(!showHistory);
          // the following three lines prevent the regular context menu (right click menu) from appearing
          e.preventDefault();
          e.stopPropagation();
          return false; // returning false disables the regular context menu
        }}
        icon={isBackward ? ICONS.ARROW_LEFT : ICONS.ARROW_RIGHT}
        iconSize={18}
      />
      {showHistory && (
        <ul className={'header__navigaiton-dropdown'} style={{ position: 'absolute' }}>
          {history.entries.slice(1, history.length).map(makeItem)}
        </ul>
      )}
    </div>
  );
};
export default ButtonNavigation;
