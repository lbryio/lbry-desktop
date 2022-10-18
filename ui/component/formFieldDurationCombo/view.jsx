/**
 * Combo-box method to define duration.
 * For the text-based version, see 'component/formFieldDuration'.
 */

// @flow
import React from 'react';

import './style.scss';
import { FormField } from 'component/common/form';

type Props = {
  duration: Duration,
  onChange: (Duration) => void,
  onBlur?: (any) => void,
  label?: string,
  placeholder?: number,
  min: number,
  step?: number,
  disabled?: boolean,
  name: string,
  units?: Array<'years' | 'months' | 'weeks' | 'days' | 'hours' | 'seconds'>,
};

const DEFAULT_UNITS = Object.freeze({
  years: 'Years',
  months: 'Months',
  weeks: 'Weeks',
  days: 'Days',
  hours: 'Hours',
  seconds: 'Seconds',
});

export default function FormFieldDurationCombo(props: Props) {
  const { duration, onChange, onBlur, min, disabled, step, label, placeholder, units } = props;

  const [value, setValue] = React.useState(duration.value);

  function handleValueChange(event: SyntheticInputEvent<*>) {
    setValue(parseFloat(event.target.value));

    onChange({
      value: event.target.value ? parseFloat(event.target.value) : 0,
      unit: duration.unit,
    });
  }

  function handleUnitChange(event: SyntheticInputEvent<*>) {
    onChange({
      value: duration.value,
      unit: event.target.value,
    });
  }

  function handleBlur(event: SyntheticInputEvent<*>) {
    if (onBlur) {
      onBlur(event);
    }
  }

  return (
    <fieldset-group class="ff-duration-combo fieldset-group--smushed">
      <FormField
        label={label || __('Duration')}
        name="duration_value"
        type="number"
        className="form-field--price-amount"
        min={min}
        value={duration.value || value}
        onWheel={(e) => e.preventDefault()}
        onChange={handleValueChange}
        onBlur={handleBlur}
        placeholder={placeholder || 5}
        disabled={disabled}
        step={step || 'any'}
      />
      <FormField
        label={'\u{2009}'}
        name="duration_unit"
        id="duration_unit"
        type="select"
        className="input--currency-select"
        disabled={disabled}
        onChange={handleUnitChange}
        value={duration.unit}
      >
        {(units || Object.keys(DEFAULT_UNITS)).map((c) => (
          <option key={c} value={c}>
            {__(DEFAULT_UNITS[c] || c)}
          </option>
        ))}
      </FormField>
    </fieldset-group>
  );
}
