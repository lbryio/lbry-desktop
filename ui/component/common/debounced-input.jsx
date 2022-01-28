// @flow
import React, { useEffect, useState } from 'react';
import Icon from 'component/common/icon';
import useDebounce from 'effects/use-debounce';

const FILTER_DEBOUNCE_MS = 300;

interface Props {
  defaultValue?: string;
  icon?: string;
  placeholder?: string;
  onChange: (newValue: string) => any;
}

export default function DebouncedInput(props: Props) {
  const { defaultValue = '', icon, placeholder = '', onChange } = props;
  const [rawValue, setRawValue] = useState(defaultValue);
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
