// @flow
import * as PAGES from 'constants/pages';
import React, { useState } from 'react';
import { FormField, Form } from 'component/common/form';
import Button from 'component/button';
import Card from 'component/common/card';
import analytics from 'analytics';
import Nag from 'component/common/nag';

type Props = {
  errorMessage: ?string,
  emailToVerify: ?string,
  doClearEmailEntry: () => void,
  doUserSignIn: (string, ?string) => void,
  onHandleEmailOnly: () => void,
};

export default function UserSignInPassword(props: Props) {
  const { errorMessage, doUserSignIn, emailToVerify, doClearEmailEntry, onHandleEmailOnly } = props;
  const [password, setPassword] = useState('');

  function handleSubmit() {
    if (emailToVerify) {
      doUserSignIn(emailToVerify, password);
      analytics.emailProvidedEvent();
    }
  }

  function handleChangeToSignIn() {
    onHandleEmailOnly();
  }

  return (
    <div className="main__sign-in">
      <Card
        title={__('Enter Your lbry.tv Password')}
        subtitle={__('Signing in with %email%', { email: emailToVerify })}
        actions={
          <div>
            <Form onSubmit={handleSubmit} className="section">
              <FormField
                autoFocus
                autoComplete="on"
                type="password"
                name="sign_in_password"
                label={__('Password')}
                value={password}
                onChange={e => setPassword(e.target.value)}
              />

              <div className="section__actions">
                <Button button="primary" type="submit" label={__('Continue')} disabled={!password} />
                <Button button="link" onClick={handleChangeToSignIn} label={__('Use Magic Link')} />
              </div>
            </Form>
          </div>
        }
        nag={errorMessage && <Nag type="error" relative message={errorMessage} />}
      />
      <p className="card__bottom-gutter">
        <Button
          button="link"
          label={__('Forgot Password?')}
          navigate={`/$/${PAGES.AUTH_PASSWORD_RESET}?email=${encodeURIComponent(emailToVerify || '')}`}
        />
        <Button button="link" onClick={doClearEmailEntry} label={__('Cancel')} />
      </p>
    </div>
  );
}
