// @flow
import React from 'react';
import { Form, FormField } from 'component/common/form';
import Button from 'component/button';
import Card from 'component/common/card';
import { setSavedPassword, deleteSavedPassword } from 'util/saved-passwords';

type Props = {
  getSync: (?string) => void,
  getSyncIsPending: boolean,
};

function SyncPassword(props: Props) {
  const { getSync, getSyncIsPending } = props;
  const [password, setPassword] = React.useState('');
  const [rememberPassword, setRememberPassword] = React.useState(true);

  function handleSubmit() {
    if (rememberPassword) {
      setSavedPassword(password);
    } else {
      deleteSavedPassword();
    }

    getSync(password);
  }

  return (
    <Form onSubmit={handleSubmit}>
      <Card
        title={__('Enter Your LBRY Password')}
        subtitle={__('You set your wallet password when you previously installed LBRY.')}
        actions={
          <div>
            <FormField
              type="password"
              label={__('Password')}
              value={password}
              onChange={e => setPassword(e.target.value)}
            />
            <FormField
              type="checkbox"
              label={__('Remember My Password')}
              checked={rememberPassword}
              onChange={() => setRememberPassword(!rememberPassword)}
            />
            <div className="card__actions">
              <Button type="submit" button="primary" label={__('Continue')} disabled={getSyncIsPending} />
            </div>
          </div>
        }
      />
    </Form>
  );
}

export default SyncPassword;
