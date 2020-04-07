// @flow
import * as PAGES from 'constants/pages';
import React, { useState } from 'react';
import { FormField, Form } from 'component/common/form';
import Button from 'component/button';
import analytics from 'analytics';
import { EMAIL_REGEX } from 'constants/email';
import I18nMessage from 'component/i18nMessage';
import { useHistory } from 'react-router-dom';
import Card from 'component/common/card';
import ErrorText from 'component/common/error-text';

type Props = {
  errorMessage: ?string,
  isPending: boolean,
  syncEnabled: boolean,
  setSync: boolean => void,
  balance: number,
  daemonSettings: { share_usage_data: boolean },
  setShareDiagnosticData: boolean => void,
  doSignUp: (string, ?string) => void,
  clearEmailError: () => void,
};

function UserEmailNew(props: Props) {
  const { errorMessage, isPending, doSignUp, setSync, daemonSettings, setShareDiagnosticData, clearEmailError } = props;
  const { share_usage_data: shareUsageData } = daemonSettings;
  const { push, location } = useHistory();
  const urlParams = new URLSearchParams(location.search);
  const emailFromUrl = urlParams.get('email');
  const defaultEmail = emailFromUrl ? decodeURIComponent(emailFromUrl) : '';
  const [email, setEmail] = useState(defaultEmail);
  const [password, setPassword] = useState('');
  const [localShareUsageData, setLocalShareUsageData] = React.useState(false);
  const [formSyncEnabled, setFormSyncEnabled] = useState(true);
  const valid = email.match(EMAIL_REGEX);

  function handleUsageDataChange() {
    setLocalShareUsageData(!localShareUsageData);
  }

  function handleSubmit() {
    setSync(formSyncEnabled);
    doSignUp(email, password === '' ? undefined : password);
    // @if TARGET='app'
    setShareDiagnosticData(true);
    // @endif
    analytics.emailProvidedEvent();
  }

  function handleChangeToSignIn() {
    clearEmailError();
    let url = `/$/${PAGES.AUTH_SIGNIN}`;
    const urlParams = new URLSearchParams(location.search);
    if (email) {
      urlParams.set('email', encodeURIComponent(email));
    }

    push(`${url}?${urlParams.toString()}`);
  }

  return (
    <div className="main__sign-up">
      <Card
        title={__('Sign Up with lbry.tv')}
        // @if TARGET='app'
        subtitle={__('An account with lbry.tv allows you to earn rewards and backup your data.')}
        // @endif
        actions={
          <div>
            <Form onSubmit={handleSubmit} className="section">
              <FormField
                autoFocus={!defaultEmail}
                placeholder={__('hotstuff_96@hotmail.com')}
                type="email"
                name="sign_up_email"
                label={__('Email')}
                value={email}
                onChange={e => setEmail(e.target.value)}
              />
              <FormField
                autoFocus={defaultEmail}
                type="password"
                name="sign_in_password"
                label={__('Password')}
                value={password}
                onChange={e => setPassword(e.target.value)}
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
                      <Button button="link" href="https://lbry.com/faq/privacy-and-data" label={__('Learn More')} />
                      {!localShareUsageData && <span className="error__text"> ({__('Required')})</span>}
                    </React.Fragment>
                  }
                />
              )}
              <div className="section__actions">
                <Button
                  button="primary"
                  type="submit"
                  label={__('Sign Up')}
                  disabled={!email || !valid || (!IS_WEB && !localShareUsageData && !shareUsageData) || isPending}
                />

                <p className="help">
                  <I18nMessage
                    tokens={{
                      terms: (
                        <Button
                          button="link"
                          href="https://www.lbry.com/termsofservice"
                          label={__('Terms of Service')}
                        />
                      ),
                    }}
                  >
                    By continuing, I agree to the %terms% and confirm I am over the age of 13.
                  </I18nMessage>
                </p>
              </div>
            </Form>
            {errorMessage && (
              <div className="section">
                <ErrorText>{errorMessage}</ErrorText>
              </div>
            )}
          </div>
        }
      />
      <p className="card__bottom-gutter">
        <I18nMessage
          tokens={{
            sign_in: <Button button="link" onClick={handleChangeToSignIn} label={__('Sign In')} />,
          }}
        >
          Already have an account? %sign_in%
        </I18nMessage>
      </p>
    </div>
  );
}

export default UserEmailNew;
