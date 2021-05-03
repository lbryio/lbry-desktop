// @flow
import React, { useEffect, useRef } from 'react';
import { remote } from 'electron';

const win = remote.BrowserWindow.getFocusedWindow();

const os = require('os').type();

type Props = {
  setSearchWindow: (boolean) => void,
  searchWindow: any,
};

const SearchScreenInput = (props: Props) => {
  const { setSearchWindow, searchWindow } = props;
  const inputRef = useRef();

  useEffect(() => {
    const handleKeyPress = (e) => {
      if (!IS_WEB && ((os !== 'Darwin' && e.ctrlKey && e.keyCode === 70) || (e.keyCode === 70 && e.metaKey))) {
        setSearchWindow(true);
        e.preventDefault();
      }

      if (e.key === 'Escape') {
        setSearchWindow(false);
        e.preventDefault();
      }
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [setSearchWindow]);

  if (!searchWindow) {
    return null;
  }

  return (
    <input
      ref={inputRef}
      autoFocus
      onChange={(e) => {
        // win.webContents.unselect();
        win.webContents.findInPage(e.target.value);
      }}
      placeholder="Search in LBRY ;)"
      className="search-screen-input"
    />
  );
};

export default SearchScreenInput;
