// @flow
import React, { useState } from 'react';
import { FormField, Form } from 'component/common/form';
import Button from 'component/button';
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
  const { errorMessage, isPending, addUserEmail, setSync } = props;
  const [newEmail, setEmail] = useState('');
  const [formSyncEnabled, setFormSyncEnabled] = useState(true);
  const valid = newEmail.match(EMAIL_REGEX);

  function handleSubmit() {
    setSync(formSyncEnabled);
    addUserEmail(newEmail);
    analytics.emailProvidedEvent();
  }

  return (
    <React.Fragment>
      <h1 className="section__title--large">{__('Sign In to lbry.tv')}</h1>
      <p className="section__subtitle">
        {/* @if TARGET='web' */}
        {__('Create a new account or sign in.')}
        {/* @endif */}
        {/* @if TARGET='app' */}
        {__('An account with lbry.tv allows you to earn rewards and backup your data.')}
        {/* @endif */}
      </p>
      <Form onSubmit={handleSubmit} className="section__body">
        <FormField
          autoFocus
          placeholder={__('hotstuff_96@hotmail.com')}
          type="email"
          name="sign_up_email"
          label={__('Email')}
          value={newEmail}
          error={errorMessage}
          onChange={e => setEmail(e.target.value)}
        />

        {!IS_WEB && (
          <FormField
            type="checkbox"
            name="sync_checkbox"
            label={
              <React.Fragment>
                {__('Backup your account and wallet data.')}{' '}
                <Button button="link" href="https://lbry.com/faq/account-sync" label={__('Learn More')} />
              </React.Fragment>
            }
            checked={formSyncEnabled}
            onChange={() => setFormSyncEnabled(!formSyncEnabled)}
          />
        )}
        <div className="card__actions">
          <Button button="primary" type="submit" label={__('Continue')} disabled={!newEmail || !valid || isPending} />
        </div>
        <p className="help">
          <React.Fragment>
            <I18nMessage
              tokens={{
                terms: (
                  <Button button="link" href="https://www.lbry.com/termsofservice" label={__('Terms of Service')} />
                ),
              }}
            >
              By continuing, I agree to the %terms% and confirm I am over the age of 13.
            </I18nMessage>
          </React.Fragment>
        </p>
      </Form>
    </React.Fragment>
  );
}

export default UserEmailNew;
