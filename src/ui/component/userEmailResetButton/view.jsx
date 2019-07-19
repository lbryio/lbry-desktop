// @flow
import React from 'react';
import Button from 'component/button';
import cookie from 'cookie';

type Props = {
  button: string,
};

function UserEmailResetButton(props: Props) {
  const { button = 'link' } = props;
  const buttonsProps = IS_WEB
    ? {
        onClick: () => {
          document.cookie = cookie.serialize('auth_token', '');
          window.location.reload();
        },
      }
    : { href: 'https://lbry.com/faq/how-to-change-email' };

  return <Button button={button} label={__('Change')} {...buttonsProps} />;
}

export default UserEmailResetButton;
