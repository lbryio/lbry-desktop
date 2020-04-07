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

type Props = {
  user: ?User,
  history: { push: string => void },
  location: { search: string },
  passwordResetPending: boolean,
};

function UserPasswordReset(props: Props) {
  const {
    doUserPasswordReset,
    location,
    history,
    passwordResetPending,
    passwordResetError,
    passwordResetSuccess,
  } = props;
  const { search } = location;
  const [email, setEmail] = React.useState('');
  const valid = email.match(EMAIL_REGEX);

  function handleSubmit() {
    doUserPasswordReset(email);
  }

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
                label={__('Email Used To Sign Up')}
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
                {passwordResetSuccess && <span className="help">Email sent!</span>}
              </div>
            </Form>
            {passwordResetError && (
              <div className="section">
                <ErrorText>{passwordResetError}</ErrorText>
              </div>
            )}
          </div>
        }
      />
      <div className="card__bottom-gutter">
        <Button button="link" label={__('Sign Up')} navigate={`/$/${PAGES.AUTH}`} /> or{' '}
        <Button button="link" label={__('Sign In')} navigate={`/$/${PAGES.AUTH_SIGNIN}`} />
      </div>
    </section>
  );
}

export default withRouter(UserPasswordReset);
