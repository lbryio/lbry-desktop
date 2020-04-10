// @flow
import * as PAGES from 'constants/pages';
import React from 'react';
import { withRouter } from 'react-router';
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
  passwordResetPending: boolean,
  passwordResetSuccess: boolean,
  passwordResetError: ?string,
};

function UserPasswordReset(props: Props) {
  const { doUserPasswordReset, passwordResetPending, passwordResetError, passwordResetSuccess, doToast } = props;
  const { search } = location;
  const urlParams = new URLSearchParams(search);
  const defaultEmail = urlParams.get('email');
  const [email, setEmail] = React.useState(defaultEmail);
  const valid = email.match(EMAIL_REGEX);

  function handleSubmit() {
    doUserPasswordReset(email);
  }

  React.useEffect(() => {
    if (passwordResetSuccess) {
      doToast({
        message: __('Email sent!'),
      });
    }
  }, [passwordResetSuccess]);

  return (
    <section className="main__sign-in">
      <Card
        title={__('Reset Your Password')}
        actions={
          <div>
            <Form onSubmit={handleSubmit} className="section">
              <FormField
                autoFocus
                placeholder={__('hotstuff_96@hotmail.com')}
                type="email"
                name="sign_in_email"
                label={__('Email')}
                value={email}
                onChange={e => setEmail(e.target.value)}
              />

              <div className="section__actions">
                <Button
                  button="primary"
                  type="submit"
                  label={passwordResetPending ? __('Resetting') : __('Reset Password')}
                  disabled={!email || !valid || passwordResetPending}
                />
                {passwordResetPending && <Spinner type="small" />}
              </div>
            </Form>
            {passwordResetError && (
              <div className="section">
                <ErrorText>{passwordResetError}</ErrorText>
              </div>
            )}
          </div>
        }
        nag={
          passwordResetSuccess && (
            <Nag type="helpful" relative message={__('Check your email for a link to reset your password.')} />
          )
        }
      />
      <div className="card__bottom-gutter">
        <Button button="link" label={__('Sign Up')} navigate={`/$/${PAGES.AUTH}`} />
        <Button button="link" label={__('Sign In')} navigate={`/$/${PAGES.AUTH_SIGNIN}`} />
      </div>
    </section>
  );
}

export default withRouter(UserPasswordReset);
