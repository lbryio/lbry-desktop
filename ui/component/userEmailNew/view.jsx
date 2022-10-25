// @flow
/*
  Saving this component for sign in/up
 */
import React from 'react';
import { FormField, Form } from 'component/common/form';
import Button from 'component/button';
import I18nMessage from 'component/i18nMessage';
import Card from 'component/common/card';
import ErrorText from 'component/common/error-text';
import Nag from 'component/common/nag';
import classnames from 'classnames';

type Props = {
  // new sync stuff
  syncEnabled: boolean,
  setSync: (boolean) => void,
  balance: number,
  daemonSettings: { share_usage_data: boolean },
  setShareDiagnosticData: (boolean) => void,
};

const SIGN_UP_MODE = 'signUp';
const SIGN_IN_MODE = 'signIn';

function UserEmailNew(props: Props) {
  const [email, setEmail] = React.useState();
  const [password, setPassword] = React.useState();
  // const [server, setServer] = React.useState();
  // const [errormessage, setErrorMessage] = React.useState();
  const [mode, setMode] = React.useState(SIGN_UP_MODE);

  // const shareUsageData = false;

  const handleSubmit = () => {};
  return (
    <div className={classnames('main__sign-up')}>
      <Card
        title={__('Cloud Connect')}
        subtitle={__('Connect your wallet to Odysee')}
        actions={
          <div>
            <Form onSubmit={handleSubmit} className="section">
              <FormField
                autoFocus
                placeholder={__('yourstruly@example.com')}
                type="email"
                name="sign_up_email"
                label={__('Email')}
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
              <FormField
                autoFocus
                placeholder={__('yourstruly@example.com')}
                type="email"
                name="sign_up_email"
                label={__('Email')}
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
              <FormField
                type="password"
                name="sign_in_password"
                label={__('Password')}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
              <div className="section__actions">
                <Button button="primary" type="submit" label={__('Sign Up')} disabled={!email || !password} />
                <Button
                  button="link"
                  onClick={setMode(mode === SIGN_UP_MODE ? SIGN_IN_MODE : SIGN_UP_MODE)}
                  label={__('Log In')}
                />
              </div>
              <p className="help--card-actions">
                <I18nMessage
                  tokens={{
                    terms: <Button button="link" href="https://www.lbry.com/termsofservice" label={__('terms')} />,
                  }}
                >
                  By creating an account, you agree to our %terms% and confirm you're over the age of 13.
                </I18nMessage>
              </p>
            </Form>
          </div>
        }
        nag={<>{'someMessage' && <Nag type="error" relative message={<ErrorText>{'someMessage'}</ErrorText>} />}</>}
      />
    </div>
  );
}

export default UserEmailNew;
