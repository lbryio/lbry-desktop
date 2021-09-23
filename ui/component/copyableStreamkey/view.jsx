// @flow
import * as ICONS from 'constants/icons';
import { FormField } from 'component/common/form';
import Button from 'component/button';
import React, { useRef, Fragment } from 'react';

type Props = {
  copyable: string,
  snackMessage: ?string,
  doToast: ({ message: string }) => void,
  primaryButton?: boolean,
  name?: string,
  onCopy?: (string) => string,
  enableMask?: boolean,
};

export default function CopyableStreamkey(props: Props) {
  const { copyable, doToast, snackMessage, primaryButton = false, name, onCopy, enableMask = true } = props;

  const input = useRef();

  function copyToClipboard() {
    const topRef = input.current;
    if (topRef[1].type === 'password') {
      navigator.clipboard.writeText(topRef[1].defaultValue);
    }
    if (topRef[1].type === 'text') {
      topRef[1].select();
      if (onCopy) {
        onCopy(topRef[1]);
      }
    }

    document.execCommand('copy');
  }

  function checkMaskType() {
    if (enableMask === true) {
      return 'password';
    }
    if (enableMask === false) {
      return 'text';
    }
  }
  function showStreamkeyFunc() {
    const topRef = input.current;
    if (topRef[1].type === 'password') {
      topRef[1].type = 'text';
      topRef[0].innerText = 'Hide';
      return;
    }
    if (topRef[1].type === 'text') {
      topRef[1].type = 'password';
      topRef[0].innerText = 'Show';
    }
  }

  return (
    <Fragment>
      <form ref={input}>
        <div>
          <label name="livestream-key">Stream key</label>{' '}
          <Button
            className="button--link"
            label={__('Show')}
            onClick={() => {
              showStreamkeyFunc();
            }}
          />
        </div>
        <FormField
          type={checkMaskType()}
          className="form-field--copyable-streamkey"
          readOnly
          name={name}
          value={copyable || ''}
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
      </form>
    </Fragment>
  );
}
