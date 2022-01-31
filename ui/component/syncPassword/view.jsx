// @flow
import React from 'react';
import { Form, FormField } from 'component/common/form';
import Button from 'component/button';
import Card from 'component/common/card';
import { setSavedPassword } from 'util/saved-passwords';
import usePersistedState from 'effects/use-persisted-state';
import I18nMessage from 'component/i18nMessage';
import { useHistory } from 'react-router';
import { SITE_HELP_EMAIL } from 'config';

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
  const {
    push,
    location: { search },
  } = useHistory();
  const urlParams = new URLSearchParams(search);
  const redirect = urlParams.get('redirect');
  const [password, setPassword] = React.useState('');
  const [rememberPassword, setRememberPassword] = usePersistedState(true);

  function handleSubmit() {
    getSync((error, hasDataChanged) => {
      handleSyncComplete(error, hasDataChanged);

      if (!error) {
        push(redirect || '/');
        setSavedPassword(password, rememberPassword);
      }
    }, password);
  }

  return (
    <Form onSubmit={handleSubmit}>
      <Card
        title={__('Enter your wallet password')}
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
              onChange={(e) => setPassword(e.target.value)}
            />
            <FormField
              name="remember-password"
              type="checkbox"
              label={__('Remember My Password')}
              checked={rememberPassword}
              onChange={() => setRememberPassword(!rememberPassword)}
            />
            <div className="card__actions">
              <Button
                type="submit"
                button="primary"
                label={getSyncIsPending ? __('Continue...') : __('Continue')}
                disabled={getSyncIsPending}
              />
              <Button button="link" label={__('Cancel')} onClick={signOut} />
            </div>
            <p className="help">
              <I18nMessage
                tokens={{
                  help: (
                    <Button
                      button="link"
                      label={__('help guide')}
                      href="https://odysee.com/@OdyseeHelp:b/OdyseeBasics:c"
                    />
                  ),
                  email: <Button button="link" href={`mailto:${SITE_HELP_EMAIL}`} label={`${SITE_HELP_EMAIL}`} />,
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
