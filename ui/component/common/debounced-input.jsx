// @flow
import React, { useEffect, useState } from 'react';
import Icon from 'component/common/icon';
import useDebounce from 'effects/use-debounce';

const FILTER_DEBOUNCE_MS = 300;

interface Props {
  icon?: string;
  value?: string;
  placeholder?: string;
  onChange: (newValue: string) => any;
}

export default function DebouncedInput(props: Props) {
  const { icon, value = '', placeholder = '', onChange } = props;
  const [rawValue, setRawValue] = useState(value);
  const debouncedValue: string = useDebounce(rawValue, FILTER_DEBOUNCE_MS);

  useEffect(() => {
    onChange(debouncedValue);
  }, [onChange, debouncedValue]);

  return (
    <div className="wunderbar">
      {icon && <Icon icon={icon} />}
      <input
        className="wunderbar__input"
        spellCheck={false}
        placeholder={placeholder}
        value={rawValue}
        onChange={(e) => setRawValue(e.target.value.trim())}
      />
    </div>
  );
}
