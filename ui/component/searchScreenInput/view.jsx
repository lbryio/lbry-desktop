import React, { useEffect, useRef, useState } from 'react';

const os = require('os').type();

const SearchScreenInput = () => {
  const [searchString, setSearchSring] = useState('');
  const inputRef = useRef();

  useEffect(() => {
    // refocus with ctrl-f after search
    const handleKeyPress = (e) => {
      if ((os !== 'Darwin' && e.ctrlKey && e.keyCode === 70) || (e.keyCode === 70 && e.metaKey)) {
        window.focus();
        inputRef.current.focus();
        e.preventDefault();
      }
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [searchString]);

  return (
    <input
      ref={inputRef}
      onKeyPress={(e) => e.key === 'Enter' && window.find(searchString)}
      autoFocus
      onChange={(e) => {
        setSearchSring(e.target.value);
      }}
      placeholder="Search in LBRY ;)"
      className="search-screen-input"
    />
  );
};

export default SearchScreenInput;
