// @flow
import React, { useEffect, useState } from 'react';
import { FormField } from 'component/common/form';
import Icon from 'component/common/icon';
import useDebounce from 'effects/use-debounce';
import classnames from 'classnames';

const FILTER_DEBOUNCE_MS = 300;

interface Props {
  defaultValue?: string;
  icon?: string;
  placeholder?: string;
  inline?: boolean;
  onChange: (newValue: string) => any;
}

export default function DebouncedInput(props: Props) {
  const { defaultValue = '', icon, placeholder = '', inline, onChange } = props;
  const [rawValue, setRawValue] = useState(defaultValue);
  const debouncedValue: string = useDebounce(rawValue, FILTER_DEBOUNCE_MS);

  useEffect(() => {
    onChange(debouncedValue);
  }, [onChange, debouncedValue]);

  return (
    <div className={classnames({ wunderbar: !inline, 'wunderbar--inline': inline })}>
      {icon && <Icon icon={icon} />}
      <FormField
        className={classnames({ wunderbar__input: !inline, 'wunderbar__input--inline': inline })}
        type="text"
        name="debounced_search"
        spellCheck={false}
        placeholder={placeholder}
        value={rawValue}
        onChange={(e) => setRawValue(e.target.value.trim())}
      />
    </div>
  );
}
