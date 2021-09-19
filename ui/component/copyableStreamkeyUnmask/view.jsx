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

  function showStreamkey() {
    if(document.getElementById('livestream-key').type === "password") {
      doToast({ message: __('Showing Stream Key') });
      document.getElementById('livestream-key').setAttribute('type', 'text');
      document.getElementById('streamkey-unmask').style.color = "white";
      document.getElementById('streamkey-unmask').innerText = "Hide Stream key";
    }
    else if(document.getElementById('livestream-key').type === "text") {
      doToast({ message: __('Hiding Stream Key') });
      document.getElementById('livestream-key').setAttribute('type', 'password');
      document.getElementById('streamkey-unmask').style.color = "white";
      document.getElementById('streamkey-unmask').innerText = "Show Stream key";
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
    <Button
      button={primaryButton ? 'primary' : 'secondary'}
      label={__('Show Stream key')}
      id="streamkey-unmask"
      name="streamkey-unmask"
      onClick={() => {
        showStreamkey();
      }}
    />
  );
}
