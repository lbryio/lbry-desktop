// @flow
import * as SETTINGS from 'constants/settings';
import * as PAGES from 'constants/pages';
import React, { useState } from 'react';
import { FormField, Form } from 'component/common/form';
import Button from 'component/button';
import { EMAIL_REGEX } from 'constants/email';
import { useHistory } from 'react-router-dom';
import UserEmailVerify from 'component/userEmailVerify';
import Card from 'component/common/card';
import Nag from 'component/common/nag';

type Props = {
  user: ?User,
  errorMessage: ?string,
  emailToVerify: ?string,
  emailDoesNotExist: boolean,
  doClearEmailEntry: () => void,
  doUserSignIn: (string, ?string) => void,
  doUserCheckIfEmailExists: string => void,
  doSetClientSetting: (string, boolean) => void,
  isPending: boolean,
};

function UserEmailReturning(props: Props) {
  const {
    user,
    errorMessage,
    doUserCheckIfEmailExists,
    emailToVerify,
    doClearEmailEntry,
    emailDoesNotExist,
    doSetClientSetting,
    isPending,
  } = props;
  const { push, location } = useHistory();
  const urlParams = new URLSearchParams(location.search);
  const emailFromUrl = urlParams.get('email');
  const emailExistsFromUrl = urlParams.get('email_exists');
  const defaultEmail = emailFromUrl ? decodeURIComponent(emailFromUrl) : '';
  const hasPasswordSet = user && user.password_set;

  const [email, setEmail] = useState(defaultEmail);
  const [syncEnabled, setSyncEnabled] = useState(true);

  const valid = email.match(EMAIL_REGEX);
  const showEmailVerification = emailToVerify || hasPasswordSet;

  function handleSubmit() {
    // @if TARGET='app'
    doSetClientSetting(SETTINGS.ENABLE_SYNC, syncEnabled);
    // @endif
    doUserCheckIfEmailExists(email);
  }

  function handleChangeToSignIn() {
    doClearEmailEntry();
    let url = `/$/${PAGES.AUTH}`;
    const urlParams = new URLSearchParams(location.search);

    urlParams.delete('email_exists');
    urlParams.delete('email');
    if (email) {
      urlParams.set('email', encodeURIComponent(email));
    }

    push(`${url}?${urlParams.toString()}`);
  }

  return (
    <div className="main__sign-in">
      {showEmailVerification ? (
        <UserEmailVerify />
      ) : (
        <Card
          title={__('Sign In to lbry.tv')}
          actions={
            <div>
              <Form onSubmit={handleSubmit} className="section">
                <FormField
                  autoFocus={!emailExistsFromUrl}
                  placeholder={__('yourstruly@example.com')}
                  type="email"
                  id="username"
                  autoComplete="on"
                  name="sign_in_email"
                  label={__('Email')}
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                />

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
                  checked={syncEnabled}
                  onChange={() => setSyncEnabled(!syncEnabled)}
                />
                {/* @endif */}

                <div className="section__actions">
                  <Button
                    autoFocus={emailExistsFromUrl}
                    button="primary"
                    type="submit"
                    label={__('Sign In')}
                    disabled={!email || !valid || isPending}
                  />
                  <Button button="link" onClick={handleChangeToSignIn} label={__('Register')} />
                </div>
              </Form>
            </div>
          }
          nag={
            <React.Fragment>
              {!emailDoesNotExist && emailExistsFromUrl && (
                <Nag type="helpful" relative message={__('That email is already in use. Did you mean to sign in?')} />
              )}
              {emailDoesNotExist && (
                <Nag
                  type="helpful"
                  relative
                  message={__("We can't find that email. Did you mean to register?")}
                  actionText={__('Register')}
                />
              )}
              {!emailExistsFromUrl && !emailDoesNotExist && errorMessage && (
                <Nag type="error" relative message={errorMessage} />
              )}
            </React.Fragment>
          }
        />
      )}
    </div>
  );
}

export default UserEmailReturning;
