// @flow
import * as ICONS from 'constants/icons';
import { FormField } from 'component/common/form';
import Button from 'component/button';
import React, { useRef } from 'react';

type Props = {
  copyable: string,
  snackMessage: ?string,
  doToast: ({ message: string }) => void,
  label?: string,
  primaryButton?: boolean,
  name?: string,
  onCopy?: (string) => string,
};

export default function CopyableText(props: Props) {
  const { copyable, doToast, snackMessage, label, primaryButton = false, name, onCopy } = props;

  const input = useRef();

  function copyToClipboard() {
    const topRef = input.current;
    if (topRef && topRef.input && topRef.input.current) {
      topRef.input.current.select();
      if (onCopy) {
        onCopy(topRef.input.current);
      }
    }

    document.execCommand('copy');
  }

  function onFocus() {
    // We have to go a layer deep since the input is inside the form component
    const topRef = input.current;
    if (topRef && topRef.input && topRef.input.current) {
      topRef.input.current.select();
    }
  }

  return (
    <FormField
      type="text"
      className="form-field--copyable"
      readOnly
      name={name}
      label={label}
      value={copyable || ''}
      ref={input}
      onFocus={onFocus}
      inputButton={
        <Button
          button={primaryButton ? 'primary' : 'secondary'}
          icon={ICONS.COPY}
          onClick={() => {
            copyToClipboard();
            doToast({
              message: snackMessage || __('Text copied'),
            });
          }}
        />
      }
    />
  );
}
