// @flow
import React from 'react';
import { Form, FormField } from 'component/common/form';
import Button from 'component/button';
import Card from 'component/common/card';
import { setSavedPassword } from 'util/saved-passwords';
import usePersistedState from 'effects/use-persisted-state';
import I18nMessage from 'component/i18nMessage';

type Props = {
  getSync: ((any, boolean) => void, ?string) => void,
  getSyncIsPending: boolean,
  email: string,
  passwordError: boolean,
  signOut: () => void,
  handleSyncComplete: (any, boolean) => void,
};

function SyncPassword(props: Props) {
  const { getSync, getSyncIsPending, email, signOut, passwordError, handleSyncComplete } = props;
  const [password, setPassword] = React.useState('');
  const [rememberPassword, setRememberPassword] = usePersistedState(true);

  function handleSubmit() {
    getSync((error, hasDataChanged) => {
      handleSyncComplete(error, hasDataChanged);

      if (!error) {
        setSavedPassword(password, rememberPassword);
      }
    }, password);
  }

  return (
    <Form onSubmit={handleSubmit}>
      <Card
        title={__('Enter Your Wallet Password')}
        subtitle={__(
          'You set your wallet password when you previously installed LBRY. This may have been on different device.'
        )}
        actions={
          <div>
            <FormField
              type="password"
              error={passwordError && __('Wrong password for %email%', { email })}
              label={__('Password for %email%', { email })}
              value={password}
              onChange={e => setPassword(e.target.value)}
            />
            <FormField
              name="remember-password"
              type="checkbox"
              label={__('Remember My Password')}
              checked={rememberPassword}
              onChange={() => setRememberPassword(!rememberPassword)}
            />
            <div className="card__actions">
              <Button type="submit" button="primary" label={__('Continue')} disabled={getSyncIsPending} />
              <Button button="link" label={__('Cancel')} onClick={signOut} />
            </div>
            <p className="help">
              <I18nMessage
                tokens={{
                  help: <Button button="link" label={__('help guide')} href="https://lbry.com/faq/account-sync" />,
                  email: <Button button="link" label={'help@lbry.com'} href="mailto:help@lbry.com" />,
                }}
              >
                If you are having issues, checkout our %help% or email us at %email%.
              </I18nMessage>
            </p>
          </div>
        }
      />
    </Form>
  );
}

export default SyncPassword;
