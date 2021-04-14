// @flow
import * as PAGES from 'constants/pages';
import { SITE_NAME, DOMAIN } from 'config';
import React, { useState } from 'react';
import { FormField, Form } from 'component/common/form';
import Button from 'component/button';
import analytics from 'analytics';
import { EMAIL_REGEX } from 'constants/email';
import I18nMessage from 'component/i18nMessage';
import { useHistory } from 'react-router-dom';
import Card from 'component/common/card';
import ErrorText from 'component/common/error-text';
import Nag from 'component/common/nag';
import classnames from 'classnames';
import OdyseeLogoWithWhiteText from 'component/header/odysee_white.png';
import OdyseeLogoWithText from 'component/header/odysee.png';

type Props = {
  errorMessage: ?string,
  emailExists: boolean,
  isPending: boolean,
  syncEnabled: boolean,
  setSync: (boolean) => void,
  balance: number,
  daemonSettings: { share_usage_data: boolean },
  setShareDiagnosticData: (boolean) => void,
  doSignUp: (string, ?string) => Promise<any>,
  clearEmailEntry: () => void,
  interestedInYoutubSync: boolean,
  doToggleInterestedInYoutubeSync: () => void,
  currentTheme: string,
};

function UserEmailNew(props: Props) {
  const {
    errorMessage,
    isPending,
    doSignUp,
    setSync,
    daemonSettings,
    setShareDiagnosticData,
    clearEmailEntry,
    emailExists,
    interestedInYoutubSync,
    doToggleInterestedInYoutubeSync,
    currentTheme,
  } = props;
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
    // @if TARGET='app'
    setSync(formSyncEnabled);
    setShareDiagnosticData(true);
    // @endif
    doSignUp(email, password === '' ? undefined : password).then(() => {
      analytics.emailProvidedEvent();
    });
  }

  function handleChangeToSignIn(additionalParams) {
    clearEmailEntry();

    let url = `/$/${PAGES.AUTH_SIGNIN}`;
    const urlParams = new URLSearchParams(location.search);

    urlParams.delete('email');
    if (email) {
      urlParams.set('email', encodeURIComponent(email));
    }

    urlParams.delete('email_exists');
    if (emailExists) {
      urlParams.set('email_exists', '1');
    }

    push(`${url}?${urlParams.toString()}`);
  }

  React.useEffect(() => {
    if (emailExists) {
      handleChangeToSignIn();
    }
  }, [emailExists]);

  return (
    <div className="main__sign-up">
      <Card
        title={__('Join %SITE_NAME%', { SITE_NAME })}
        // @if TARGET='app'
        subtitle={__('An account with %domain% allows you to earn rewards and backup your data.', { domain: DOMAIN })}
        // @endif
        actions={
          <div className={classnames({ 'card--disabled': DOMAIN === 'lbry.tv' })}>
            <Form onSubmit={handleSubmit} className="section">
              <FormField
                autoFocus
                placeholder={__('yourstruly@example.com')}
                type="email"
                name="sign_up_email"
                label={__('Email')}
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
              <FormField
                type="password"
                name="sign_in_password"
                label={__('Password')}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />

              {/* @if TARGET='web' */}
              <FormField
                type="checkbox"
                name="youtube_sync_checkbox"
                label={__('Sync my YouTube channel')}
                checked={interestedInYoutubSync}
                onChange={() => doToggleInterestedInYoutubeSync()}
              />
              {/* @endif */}

              {/* @if TARGET='app' */}
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
              {/* @endif */}

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
                  disabled={
                    !email || !password || !valid || (!IS_WEB && !localShareUsageData && !shareUsageData) || isPending
                  }
                />
                <Button button="link" onClick={handleChangeToSignIn} label={__('Log In')} />
              </div>
              <p className="help--card-actions">
                <I18nMessage
                  tokens={{
                    terms: <Button button="link" href="https://www.lbry.com/termsofservice" label={__('terms')} />,
                  }}
                >
                  By creating an account, you agree to our %terms% and confirm you're over the age of 13.
                </I18nMessage>
              </p>
            </Form>
          </div>
        }
        nag={
          <>
            {IS_WEB && DOMAIN === 'lbry.tv' && (
              <Nag
                relative
                message={
                  <I18nMessage
                    tokens={{
                      odysee: (
                        <Button button="link" label={__('odysee.com')} href="https://odysee.com?src=lbrytv-retired" />
                      ),
                    }}
                  >
                    {__(
                      'lbry.tv is being retired in favor of %odysee% and new sign ups are disabled. Sign up on %odysee% instead'
                    )}
                  </I18nMessage>
                }
              />
            )}
            {errorMessage && <Nag type="error" relative message={<ErrorText>{errorMessage}</ErrorText>} />}
          </>
        }
      />

      {IS_WEB && DOMAIN === 'lbry.tv' && (
        <div className="signup__odysee-logo">
          <Button href="https://odysee.com?src=lbrytv-retired">
            <img src={currentTheme === 'light' ? OdyseeLogoWithText : OdyseeLogoWithWhiteText} />
          </Button>
        </div>
      )}
    </div>
  );
}

export default UserEmailNew;
