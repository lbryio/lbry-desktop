// @flow
import Button from 'component/button';
import React from 'react';

type Props = {
  snackMessage: ?string,
  doToast: ({ message: string }) => void,
  label?: string,
  primaryButton?: boolean,
  name?: string,
};

export default function CopyableText(props: Props) {
  const { doToast, primaryButton = false } = props;

  function showStreamkey() {
    if (document.getElementById('livestream-key').type === 'password') {
      doToast({ message: __('Showing Stream Key') });
      document.getElementById('livestream-key').setAttribute('type', 'text');
      document.getElementById('streamkey-unmask').style.color = 'white';
      document.getElementById('streamkey-unmask').innerText = 'Hide Stream key';
    } else if (document.getElementById('livestream-key').type === 'text') {
      doToast({ message: __('Hiding Stream Key') });
      document.getElementById('livestream-key').setAttribute('type', 'password');
      document.getElementById('streamkey-unmask').style.color = 'white';
      document.getElementById('streamkey-unmask').innerText = 'Show Stream key';
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
