// @flow
import * as PAGES from 'constants/pages';
import React from 'react';
import { Lbryio } from 'lbryinc';
import { useHistory } from 'react-router';
import Card from 'component/common/card';
import { Form, FormField } from 'component/common/form';
import ErrorText from 'component/common/error-text';
import Button from 'component/button';

type Props = {
  user: ?User,
  history: { push: string => void },
  location: { search: string },
  passwordSetPending: boolean,
  passwordSetError: boolean,
};

function UserPasswordReset(props: Props) {
  const { passwordSetPending, passwordSetError } = props;
  const { location } = useHistory();
  const urlParams = new URLSearchParams(location.search);
  const email = urlParams.get('email');
  const authToken = urlParams.get('auth_token');
  const [password, setPassword] = React.useState('');

  function handleSubmit() {
    Lbryio.call(
      'user_password',
      'set',
      {
        auth_token: authToken,
        password,
      },
      'post'
    )
      .then(res => {
        debugger;
      })
      .catch(error => {
        debugger;
      });
  }

  return (
    <section className="main__sign-in">
      <Card
        title={__('Choose A New Password')}
        subtitle={__('Setting a new password for %email%', { email })}
        actions={
          <div>
            <Form onSubmit={handleSubmit} className="section">
              <FormField
                autoFocus
                type="password"
                name="password_set"
                label={__('New Password')}
                value={password}
                onChange={e => setPassword(e.target.value)}
              />

              <div className="section__actions">
                <Button
                  button="primary"
                  type="submit"
                  label={passwordSetPending ? __('Updating') : __('Update Password')}
                  disabled={!password || passwordSetPending}
                />
              </div>
            </Form>
            {passwordSetError && (
              <div className="section">
                <ErrorText>{passwordSetError}</ErrorText>
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

export default UserPasswordReset;
