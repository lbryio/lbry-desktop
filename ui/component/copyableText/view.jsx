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
  enableInputMask?: boolean,
};

export default function CopyableText(props: Props) {
  const { copyable, doToast, snackMessage, label, primaryButton = false, name, onCopy, enableInputMask } = props;
  const [maskInput, setMaskInput] = React.useState(enableInputMask);

  const input = useRef();

  function handleCopyText() {
    if (enableInputMask) {
      navigator.clipboard
        .writeText(copyable)
        .then(() => {
          doToast({ message: snackMessage || __('Text copied') });
        })
        .catch(() => {
          doToast({ message: __('Failed to copy.'), isError: true });
        });
    } else {
      const topRef = input.current;
      if (topRef && topRef.input && topRef.input.current) {
        topRef.input.current.select();
        if (onCopy) {
          // Allow clients to change the selection before making the copy.
          onCopy(topRef.input.current);
        }
      }

      document.execCommand('copy');
      doToast({ message: snackMessage || __('Text copied') });
    }
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
      type={maskInput ? 'password' : 'text'}
      className="form-field--copyable"
      readOnly
      name={name}
      label={label}
      value={copyable || ''}
      ref={input}
      onFocus={onFocus}
      inputButton={
        <Button button={primaryButton ? 'primary' : 'secondary'} icon={ICONS.COPY} onClick={handleCopyText} />
      }
      helper={
        enableInputMask && (
          <Button button="link" onClick={() => setMaskInput(!maskInput)} label={maskInput ? __('Show') : __('Hide')} />
        )
      }
    />
  );
}
