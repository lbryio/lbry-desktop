// @flow
import React from 'react';
import Button from 'component/button';

type Props = {
  button: string,
  label?: string,
  doSignOut: () => void,
  doClearEmailEntry: () => void,
  doClearPasswordEntry: () => void,
};

function UserSignOutButton(props: Props) {
  const { button = 'link', doSignOut, doClearEmailEntry, doClearPasswordEntry, label } = props;

  return (
    <Button
      button={button}
      label={label || __('Sign Out')}
      onClick={() => {
        doClearPasswordEntry();
        doClearEmailEntry();
        doSignOut();
      }}
    />
  );
}

export default UserSignOutButton;
