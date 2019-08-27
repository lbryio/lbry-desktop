// @flow
import React, { useState } from 'react';
import { FormField, Form } from 'component/common/form';
import Button from 'component/button';
import { Lbryio } from 'lbryinc';
import analytics from 'analytics';

type Props = {
  errorMessage: ?string,
  isPending: boolean,
  addUserEmail: string => void,
};

function UserEmailNew(props: Props) {
  const { errorMessage, isPending, addUserEmail } = props;
  const [newEmail, setEmail] = useState('');
  const [sync, setSync] = useState(false);

  function handleSubmit() {
    addUserEmail(newEmail);
    analytics.emailProvidedEvent();

    // @if TARGET='web'
    Lbryio.call('user_tag', 'edit', { add: 'lbrytv' });
    // @endif
  }

  return (
    <Form onSubmit={handleSubmit}>
      <FormField
        type="email"
        id="sign_up_email"
        label={__('Email')}
        value={newEmail}
        error={errorMessage}
        onChange={e => setEmail(e.target.value)}
      />
      <FormField
        type="checkbox"
        id="sign_up_sync"
        label={__('Sync my bidnezz on this device')}
        helper={__('Maybe some additional text with this field')}
        checked={sync}
        onChange={() => setSync(!sync)}
      />

      <Button button="primary" type="submit" label={__('Continue')} disabled={isPending} />
    </Form>
  );
}

export default UserEmailNew;
