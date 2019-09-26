// @flow
import React, { useState } from 'react';
import { FormField, Form } from 'component/common/form';
import Button from 'component/button';
import { Lbryio } from 'lbryinc';
import analytics from 'analytics';
import { EMAIL_REGEX } from 'constants/email';

type Props = {
  errorMessage: ?string,
  isPending: boolean,
  addUserEmail: string => void,
  syncEnabled: boolean,
  setSync: boolean => void,
  balance: number,
};

function UserEmailNew(props: Props) {
  const { errorMessage, isPending, addUserEmail, syncEnabled, setSync, balance } = props;
  const [newEmail, setEmail] = useState('');
  const valid = newEmail.match(EMAIL_REGEX);

  function handleSubmit() {
    addUserEmail(newEmail);
    analytics.emailProvidedEvent();

    // @if TARGET='web'
    Lbryio.call('user_tag', 'edit', { add: 'lbrytv' });
    // @endif
  }

  React.useEffect(() => {
    if (syncEnabled && balance) {
      setSync(false);
    }
  }, [balance, syncEnabled, setSync]);

  return (
    <div>
      <h1 className="section__title--large">{__('Welcome To LBRY')}</h1>
      <p className="section__subtitle">{__('Create a new account or sign in.')}</p>
      <Form onSubmit={handleSubmit} className="section__body">
        <FormField
          autoFocus
          className="form-field--short"
          placeholder={__('hotstuff_96@hotmail.com')}
          type="email"
          name="sign_up_email"
          label={__('Email')}
          value={newEmail}
          error={errorMessage}
          onChange={e => setEmail(e.target.value)}
        />
        <FormField
          type="checkbox"
          name="sync_checkbox"
          label={__('Sync your balance between devices')}
          helper={
            balance > 0 ? __('This is only available for empty wallets') : __('Maybe some more text about something')
          }
          checked={syncEnabled}
          onChange={() => setSync(!syncEnabled)}
          disabled={balance > 0}
        />
        <div className="card__actions">
          <Button button="primary" type="submit" label={__('Continue')} disabled={!newEmail || !valid || isPending} />
        </div>
      </Form>
    </div>
  );
}

export default UserEmailNew;
