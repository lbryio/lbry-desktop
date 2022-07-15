// @flow
import * as React from 'react';
import Button from 'component/button';

type CountInfoProps = {
  charCount?: number,
  textAreaMaxLength?: number,
};

export const CountInfo = (countInfoProps: CountInfoProps) => {
  const { charCount, textAreaMaxLength } = countInfoProps;

  // Ideally, the character count should (and can) be appended to the
  // SimpleMDE's "options::status" bar. However, I couldn't figure out how
  // to pass the current value to it's callback, nor query the current
  // text length from the callback. So, we'll use our own widget.
  const hasCharCount = charCount !== undefined && charCount >= 0;

  return (
    hasCharCount &&
    textAreaMaxLength !== undefined && (
      <span className="comment__char-count-mde">{`${charCount || '0'}/${textAreaMaxLength}`}</span>
    )
  );
};

type QuickActionProps = {
  label?: string,
  quickActionHandler?: (any) => any,
};

export const QuickAction = (quickActionProps: QuickActionProps) => {
  const { label, quickActionHandler } = quickActionProps;

  return label && quickActionHandler ? (
    <div className="form-field__quick-action">
      <Button button="link" onClick={quickActionHandler} label={label} />
    </div>
  ) : null;
};

type LabelProps = {
  name: string,
  label?: any,
  errorMessage?: any,
};

export const Label = (labelProps: LabelProps) => {
  const { name, label, errorMessage } = labelProps;

  return <label htmlFor={name}>{errorMessage ? <span className="error__text">{errorMessage}</span> : label}</label>;
};
