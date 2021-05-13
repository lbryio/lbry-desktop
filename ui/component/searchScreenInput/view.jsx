// @flow
import React, { useEffect, useRef, useState } from 'react';
import { remote } from 'electron';

const win = remote.BrowserWindow.getFocusedWindow();

const os = require('os').type();

type Props = {
  setSearchWindow: (boolean) => void,
  searchWindow: any,
};

const SearchScreenInput = (props: Props) => {
  const { setSearchWindow, searchWindow } = props;
  const [searchValue, setSearchValue] = useState('');
  const inputRef = useRef();

  useEffect(() => {
    const handleKeyPress = (e) => {
      if (!IS_WEB && ((os !== 'Darwin' && e.ctrlKey && e.keyCode === 70) || (e.keyCode === 70 && e.metaKey))) {
        if (!searchWindow) setSearchWindow(true);
        if (inputRef.current) inputRef.current.focus();
        e.preventDefault();
      }

      if (e.key === 'Escape') {
        setSearchWindow(false);
        e.preventDefault();
      }

      if (e.key === 'Enter') {
        win.webContents.findInPage(searchValue);
        e.preventDefault();
      }
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [inputRef, searchValue, searchWindow, setSearchWindow]);

  useEffect(() => {
    if (!searchWindow) win.webContents.stopFindInPage('clearSelection');
  }, [searchWindow]);

  if (!searchWindow) {
    return null;
  }

  return (
    <input
      ref={inputRef}
      onChange={(e) => {
        setSearchValue(e.target.value);
      }}
      autoFocus
      placeholder="Search in LBRY ;)"
      className="search-screen-input"
    />
  );
};

export default SearchScreenInput;
