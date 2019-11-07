// @flow
import React from 'react';
import Button from 'component/button';

type Props = {
  button: string,
  label?: string,
  signOut: () => void,
};

function UserSignOutButton(props: Props) {
  const { button = 'link', signOut, label } = props;

  return <Button button={button} label={label || __('Sign Out')} onClick={signOut} />;
}

export default UserSignOutButton;
