// @flow
import React, { useState } from 'react';
import { FormField, Form } from 'component/common/form';
import Button from 'component/button';
import { Lbryio } from 'lbryinc';
import analytics from 'analytics';
import { EMAIL_REGEX } from 'constants/email';
import I18nMessage from 'component/i18nMessage';

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
  const [ageConfirmation, setAgeConfirmation] = useState(true);
  const valid = newEmail.match(EMAIL_REGEX);

  function handleSubmit() {
    addUserEmail(newEmail);
    analytics.emailProvidedEvent();

    // @if TARGET='web'
    Lbryio.call('user_tag', 'edit', { add: 'lbrytv' });
    // @endif
  }

  React.useEffect(() => {
    // Sync currently doesn't work for wallets with balances
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
        <div className="section">
          <FormField
            type="checkbox"
            name="age_checkbox"
            label={
              <I18nMessage
                tokens={{
                  terms: (
                    <Button button="link" href="https://www.lbry.com/termsofservice" label={__('Terms of Service')} />
                  ),
                }}
              >
                I am over the age of 13 and agree to the %terms%.
              </I18nMessage>
            }
            checked={ageConfirmation}
            onChange={() => setAgeConfirmation(!ageConfirmation)}
          />
          {!IS_WEB && (
            <FormField
              type="checkbox"
              name="sync_checkbox"
              label={__('Sync balance and preferences across devices')}
              helper={
                balance > 0 ? (
                  __('This feature is not yet available for wallets with balances, but the gerbils are working on it.')
                ) : (
                  <I18nMessage
                    tokens={{
                      learn_more: (
                        <Button button="link" href="https://lbry.com/faq/account-sync" label={__('Learn More')} />
                      ),
                    }}
                  >
                    Blockchain expert? %learn_more%
                  </I18nMessage>
                )
              }
              checked={syncEnabled}
              onChange={() => setSync(!syncEnabled)}
              disabled={balance > 0}
            />
          )}
          <div className="card__actions">
            <Button
              button="primary"
              type="submit"
              label={__('Continue')}
              disabled={!newEmail || !valid || !ageConfirmation || isPending}
            />
          </div>
        </div>
      </Form>
    </div>
  );
}

export default UserEmailNew;
