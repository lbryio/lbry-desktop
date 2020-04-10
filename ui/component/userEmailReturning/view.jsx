// @flow
import * as PAGES from 'constants/pages';
import React, { useState } from 'react';
import { FormField, Form } from 'component/common/form';
import Button from 'component/button';
import { EMAIL_REGEX } from 'constants/email';
import { useHistory } from 'react-router-dom';
import UserEmailVerify from 'component/userEmailVerify';
import Card from 'component/common/card';
import Nag from 'component/common/nag';
import analytics from 'analytics';

type Props = {
  errorMessage: ?string,
  emailToVerify: ?string,
  emailDoesNotExist: boolean,
  doClearEmailEntry: () => void,
  doUserSignIn: (string, ?string) => void,
  doUserCheckIfEmailExists: string => void,
};

function UserEmailReturning(props: Props) {
  const { errorMessage, doUserCheckIfEmailExists, emailToVerify, doClearEmailEntry, emailDoesNotExist } = props;
  const { push, location } = useHistory();
  const urlParams = new URLSearchParams(location.search);
  const emailFromUrl = urlParams.get('email');
  const emailExistsFromUrl = urlParams.get('email_exists');
  const defaultEmail = emailFromUrl ? decodeURIComponent(emailFromUrl) : '';
  const [email, setEmail] = useState(defaultEmail);
  const valid = email.match(EMAIL_REGEX);
  const showEmailVerification = emailToVerify;

  function handleSubmit() {
    doUserCheckIfEmailExists(email);
    analytics.emailProvidedEvent();
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
                  placeholder={__('hotstuff_96@hotmail.com')}
                  type="email"
                  name="sign_in_email"
                  label={__('Email')}
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                />

                <div className="section__actions">
                  <Button
                    autoFocus={emailExistsFromUrl}
                    button="primary"
                    type="submit"
                    label={__('Sign In')}
                    disabled={!email || !valid}
                  />
                  <Button button="link" onClick={handleChangeToSignIn} label={__('Sign Up')} />
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
                  message={__("We can't find that email. Did you mean to sign up?")}
                  actionText={__('Sign Up')}
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
