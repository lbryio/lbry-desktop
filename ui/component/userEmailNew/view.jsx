// @flow
import React, { useState } from 'react';
import { FormField, Form } from 'component/common/form';
import Button from 'component/button';
import analytics from 'analytics';
import { EMAIL_REGEX } from 'constants/email';

type Props = {
  errorMessage: ?string,
  isPending: boolean,
  addUserEmail: string => void,
  syncEnabled: boolean,
  setSync: boolean => void,
  balance: number,
  daemonSettings: { share_usage_data: boolean },
  setShareDiagnosticData: boolean => void,
};

function UserEmailNew(props: Props) {
  const { errorMessage, isPending, addUserEmail, setSync, daemonSettings, setShareDiagnosticData } = props;
  const { share_usage_data: shareUsageData } = daemonSettings;
  const [newEmail, setEmail] = useState('');
  const [localShareUsageData, setLocalShareUsageData] = React.useState(false);
  const [formSyncEnabled, setFormSyncEnabled] = useState(true);
  const valid = newEmail.match(EMAIL_REGEX);

  function handleUsageDataChange() {
    setLocalShareUsageData(!shareUsageData);
  }

  function handleSubmit() {
    setSync(formSyncEnabled);
    addUserEmail(newEmail);
    // @if TARGET='app'
    setShareDiagnosticData(true);
    // @endif
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

        {!shareUsageData && !IS_WEB && (
          <FormField
            type="checkbox"
            name="share_data_checkbox"
            checked={localShareUsageData}
            onChange={handleUsageDataChange}
            label={
              <React.Fragment>
                {__('Share usage data with LBRY inc.')}{' '}
                <Button button="link" href="https://lbry.com/faq/account-sync" label={__('Learn More')} />
                {!localShareUsageData && <span className="error-text"> ({__('Required')})</span>}
              </React.Fragment>
            }
          />
        )}
        <div className="card__actions">
          <Button
            button="primary"
            type="submit"
            label={__('Continue')}
            disabled={!newEmail || !valid || !setShareDiagnosticData || isPending}
          />
        </div>
      </Form>
    </React.Fragment>
  );
}

export default UserEmailNew;
