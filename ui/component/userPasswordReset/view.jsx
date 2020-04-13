// @flow
import * as PAGES from 'constants/pages';
import React from 'react';
import { useHistory } from 'react-router-dom';
import Card from 'component/common/card';
import Spinner from 'component/spinner';
import { Form, FormField } from 'component/common/form';
import { EMAIL_REGEX } from 'constants/email';
import ErrorText from 'component/common/error-text';
import Button from 'component/button';
import Nag from 'component/common/nag';

type Props = {
  user: ?User,
  doToast: ({ message: string }) => void,
  doUserPasswordReset: string => void,
  doClearPasswordEntry: () => void,
  doClearEmailEntry: () => void,
  passwordResetPending: boolean,
  passwordResetSuccess: boolean,
  passwordResetError: ?string,
};

function UserPasswordReset(props: Props) {
  const {
    doUserPasswordReset,
    passwordResetPending,
    passwordResetError,
    passwordResetSuccess,
    doToast,
    doClearPasswordEntry,
    doClearEmailEntry,
  } = props;
  const { location, push } = useHistory();
  const { search } = location;
  const urlParams = new URLSearchParams(search);
  const defaultEmail = urlParams.get('email');
  const [email, setEmail] = React.useState(defaultEmail || '');
  const valid = email.match(EMAIL_REGEX);

  function handleSubmit() {
    if (email) {
      doUserPasswordReset(email);
    }
  }

  function handleRestart() {
    setEmail('');
    doClearPasswordEntry();
    doClearEmailEntry();
    push(`/$/${PAGES.AUTH_SIGNIN}`);
  }

  React.useEffect(() => {
    if (passwordResetSuccess) {
      doToast({
        message: __('Email sent!'),
      });
    }
  }, [passwordResetSuccess, doToast]);

  return (
    <section className="main__sign-in">
      <Card
        title={__('Reset Your Password')}
        actions={
          <div>
            <Form onSubmit={handleSubmit} className="section">
              <FormField
                autoFocus
                disabled={passwordResetSuccess}
                placeholder={__('hotstuff_96@hotmail.com')}
                type="email"
                name="sign_in_email"
                id="username"
                autoComplete="on"
                label={__('Email')}
                value={email}
                onChange={e => setEmail(e.target.value)}
              />

              <div className="section__actions">
                <Button
                  button="primary"
                  type="submit"
                  label={passwordResetPending ? __('Resetting') : __('Reset Password')}
                  disabled={!email || !valid || passwordResetPending || passwordResetSuccess}
                />
                <Button button="link" label={__('Cancel')} onClick={handleRestart} />
                {passwordResetPending && <Spinner type="small" />}
              </div>
            </Form>
          </div>
        }
        nag={
          <React.Fragment>
            {passwordResetError && <Nag type="error" relative message={<ErrorText>{passwordResetError}</ErrorText>} />}
            {passwordResetSuccess && (
              <Nag type="helpful" relative message={__('Check your email for a link to reset your password.')} />
            )}
          </React.Fragment>
        }
      />
    </section>
  );
}

export default UserPasswordReset;
