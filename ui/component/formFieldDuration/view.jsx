// @flow
import type { Node } from 'react';
import React from 'react';
import parseDuration from 'parse-duration';
import { FormField } from 'component/common/form';
import Icon from 'component/common/icon';
import * as ICONS from 'constants/icons';

// prettier-ignore
const TOOLTIP = 'Units:\n • s:  seconds\n • m:  minutes \n • h:  hours\n • d:  days\n • b:  months\n • month:  months\n • y:  years';
const ONE_HUNDRED_YEARS_IN_SECONDS = 3154000000;

type Props = {
  name: string,
  label?: string | Node,
  placeholder?: string | number,
  disabled?: boolean,
  value: string | number,
  onChange: (any) => void,
  onResolve: (valueInSeconds: number) => void, // Returns parsed/resolved value in seconds; "-1" for invalid input.
  maxDurationInSeconds?: number,
};

export default function FormFieldDuration(props: Props) {
  const { name, label, placeholder, disabled, value, onChange, onResolve, maxDurationInSeconds } = props;
  const [valueSec, setValueSec] = React.useState(-1);
  const [valueErr, setValueErr] = React.useState('');

  React.useEffect(() => {
    const handleInvalidInput = (errMsg: string) => {
      if (valueSec !== -1) {
        setValueSec(-1);
      }
      if (valueErr !== errMsg) {
        setValueErr(errMsg);
      }
      onResolve(-1);
    };

    const handleValidInput = (seconds) => {
      if (seconds !== valueSec) {
        setValueSec(seconds);
        onResolve(seconds);
      }
      if (valueErr) {
        setValueErr('');
      }
    };

    if (!value) {
      handleValidInput(-1); // Reset
      return;
    }

    const seconds = parseDuration(value, 's');
    if (Number.isInteger(seconds) && seconds > 0) {
      const max = maxDurationInSeconds || ONE_HUNDRED_YEARS_IN_SECONDS;
      if (seconds > max) {
        handleInvalidInput(__('Value exceeded maximum.'));
      } else {
        handleValidInput(seconds);
      }
    } else {
      handleInvalidInput(__('Invalid duration.'));
    }
  }, [value, valueSec, valueErr, maxDurationInSeconds, onResolve]);

  return (
    <FormField
      name={name}
      type="text"
      disabled={disabled}
      label={
        <>
          {label || __('Duration --[period e.g. ban duration]--')}
          <Icon customTooltipText={__(TOOLTIP)} className="icon--help" icon={ICONS.HELP} tooltip size={16} />
        </>
      }
      placeholder={placeholder || '30s, 10m, 1h, 2d, 3month, 1y'}
      value={value}
      onChange={onChange}
      error={valueErr}
    />
  );
}
