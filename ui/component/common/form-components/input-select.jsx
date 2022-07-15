// @flow
import * as React from 'react';
import { Label } from './common';

type InputSelectProps = {
  name: string,
  className?: string,
  label?: any,
  errorMessage?: any,
  children?: any,
};

export const InputSelect = (inputSelectProps: InputSelectProps) => {
  const { name, className, errorMessage, label, children, ...inputProps } = inputSelectProps;

  return (
    <fieldset-section class={className || ''}>
      {(label || errorMessage) && <Label name={name} label={label} errorMessage={errorMessage} />}

      <select id={name} {...inputProps}>
        {children}
      </select>
    </fieldset-section>
  );
};
