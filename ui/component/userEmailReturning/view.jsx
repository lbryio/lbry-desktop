// @flow
import * as PAGES from 'constants/pages';
import React, { useState } from 'react';
import { FormField, Form } from 'component/common/form';
import Button from 'component/button';
import { EMAIL_REGEX } from 'constants/email';
import I18nMessage from 'component/i18nMessage';
import { useHistory } from 'react-router-dom';
import usePersistedState from 'effects/use-persisted-state';
import UserEmailVerify from 'component/userEmailVerify';
import ErrorText from 'component/common/error-text';
import Card from 'component/common/card';
import analytics from 'analytics';

type Props = {
  errorMessage: ?string,
  emailToVerify: ?string,
  doClearEmailError: () => void,
  doUserSignIn: (string, ?string) => void,
};

function UserEmailReturning(props: Props) {
  const { errorMessage, doUserSignIn, emailToVerify, doClearEmailError } = props;
  const { push, location } = useHistory();
  const urlParams = new URLSearchParams(location.search);
  const emailFromUrl = urlParams.get('email');
  const defaultEmail = emailFromUrl ? decodeURIComponent(emailFromUrl) : '';
  const [email, setEmail] = useState(defaultEmail);
  const [preloadedEmail] = useState(!!defaultEmail);
  const [showPassword, setShowPassword] = usePersistedState('sign-in-show-password', !!defaultEmail);
  const [password, setPassword] = useState('');

  const valid = email.match(EMAIL_REGEX);
  const showEmailVerification = emailToVerify;

  function handleSubmit() {
    doUserSignIn(email, password === '' ? undefined : password);
    analytics.emailProvidedEvent();
  }

  function handleChangeToSignIn() {
    doClearEmailError();
    push(`/$/${PAGES.AUTH}${location.search}`); // TODO: Don't lose redirect url right here
  }

  return (
    <div className="main__sign-in">
      {showEmailVerification ? (
        <UserEmailVerify />
      ) : (
        <div>
          <Card
            title={__('Sign In to lbry.tv')}
            actions={
              <div>
                <Form onSubmit={handleSubmit} className="section">
                  <FormField
                    autoFocus={!preloadedEmail}
                    placeholder={__('hotstuff_96@hotmail.com')}
                    type="email"
                    name="sign_in_email"
                    label={__('Email')}
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                  />
                  {showPassword && (
                    <FormField
                      autoFocus={preloadedEmail}
                      type="password"
                      name="sign_in_password"
                      label={__('Password')}
                      value={password}
                      onChange={e => setPassword(e.target.value)}
                    />
                  )}
                  {!showPassword && (
                    <fieldset-section>
                      <FormField
                        type="checkbox"
                        placeholder={__('hotstuff_96@hotmail.com')}
                        name="sign_in_toggle_password"
                        label={__('Sign in with a password (optional)')}
                        checked={showPassword}
                        onChange={() => setShowPassword(!showPassword)}
                      />
                    </fieldset-section>
                  )}

                  <div className="section__actions">
                    <Button button="primary" type="submit" label={__('Continue')} disabled={!email || !valid} />
                    <Button button="link" onClick={handleChangeToSignIn} label={__('Sign Up')} />
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
            <Button button="link" label={__('Forgot Password?')} navigate={`/$/${PAGES.AUTH_PASSWORD_RESET}`} />
          </p>
        </div>
      )}
    </div>
  );
}

export default UserEmailReturning;
