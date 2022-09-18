// @flow
import * as React from 'react';
import Page from 'component/page';
import Card from 'component/common/card';
import Button from 'component/button';
import { Form, FormField } from 'component/common/form';
import I18nMessage from 'component/i18nMessage';
import Spinner from 'component/spinner';
import * as ICONS from 'constants/icons';

type Props = {
  walletEncrypted: boolean,
  encryptWallet: (string) => void,
  decryptWallet: (string) => void,
  registering: boolean,
  email: string,
  registerError: string,
  token: string,
  authenticating: boolean,
  authError: string,
  derivingKeys: boolean,
  encHmacKey: string, // ?
  encRootPass: string,
  encProviderPass: string,
  getSalt: (string) => void,
  gettingSalt: boolean,
  saltError: string,
  saltSeed: string,
  deriveSecrets: (string, string, string) => void, // something
};

export default function NotificationSettingsPage(props: Props) {
  // const {  } = props;
  const {
    walletEncrypted,
    encryptWallet,
    decryptWallet,
    registering,
    registeredEmail,
    registerError,
    token,
    authenticating,
    authError,
    authenticate,
    derivingKeys,
    encHmacKey, // ?
    encRootPass,
    encProviderPass,
    getSalt,
    generateSaltSeed,
    deriveSecrets,
    gettingSalt,
    saltError,
    saltSeed,
    register,
  } = props;

  const SIGN_IN_MODE = 'sign_in';
  const SIGN_UP_MODE = 'sign_up';
  const VERIFY_MODE = 'verify';
  const MATH_MODE = 'math';
  const DONE_MODE = 'done';

  const [mode, setMode] = React.useState(registeredEmail ? VERIFY_MODE : SIGN_IN_MODE);

  const [email, setEmail] = React.useState();
  const [pass, setPass] = React.useState();
  const [showPass, setShowPass] = React.useState(false);
  const [error, setError] = React.useState('');

  React.useEffect(() => {
    let interval;
    if (!token && registeredEmail) {
      interval = setInterval(() => {
        console.log('doauthint');
        authenticate();
      }, 5000);
    }
    return () => {
      clearInterval(interval);
    };
  }, [registeredEmail, token, authenticate]);

  React.useEffect(() => {
    if (token && registeredEmail) {
      setMode(DONE_MODE);
    }
  }, [registeredEmail, token, setMode]);

  const handleSignUp = async () => {
    // get salt for email to make sure
    const saltSeedOrError = await getSalt(email);
    if (saltSeedOrError.seed) {
      setError('Email already registered');
      return;
    }
    // -- if found, report email already exists - sign in?
    const saltSeed = await generateSaltSeed();
    // saltSeed = generateSaltSeed()
    setMode(MATH_MODE);
    const secrets = await deriveSecrets(pass, email, saltSeed);
    setMode(VERIFY_MODE);
    // passwords = driveKeys(root, email, saltSeed);
    try {
      const registerSuccess = await register(email, secrets, saltSeed);
    } catch (e) {
      console.log(e);
    }
    // registerSuccess = register(email, servicePassword, saltSeed)

    // poll auth until success
    // store [token, rootPassword, providerPass, HmacKey, saltSeed, salt, registeredEmail]
  };

  const handleSignIn = async () => {
    // get saltseed for email
    // saltSeed = getSaltSeed()
    // -- if error, report email not registered - sign up?
    // salt = generateSalt(seed)
    // passwords = deriveKeys(root, email, saltSeed);
    // token = authenticate(email, servicePassword, deviceId)
    // store [token, rootPassword, servicePassword, HmacKey, saltSeed, salt, registeredEmail]
    // kick off sync pull
    // -- possibly merge conflicts
  };

  const doneCard = (
    <Card
      title={__('Done!')}
      subtitle={
        <I18nMessage
          tokens={{
            email: email,
          }}
        >
          You are signed in as %email%.
        </I18nMessage>
      }
      actions={<div>Like, done and stuff...</div>}
    />
  );

  const verifyCard = (
    <Card
      title={__('Verifying')}
      subtitle={__('We have sent you an email to verify your account.')}
      actions={<div>Waiting for verification...</div>}
    />
  );

  const deriveCard = (
    <Card title={__('Doing Math')} subtitle={__('Hold on, doing some math.')} actions={<div>Math...</div>} />
  );

  const signInCard = (
    <Card
      title={__('Sign In')}
      subtitle={
        <>
          <p>
            <I18nMessage
              tokens={{
                sign_up: <Button button="link" onClick={() => setMode(SIGN_UP_MODE)} label={__('Sign up')} />,
              }}
            >
              Sign in to your sync account. Or %sign_up%.
            </I18nMessage>
          </p>
        </>
      }
      actions={
        <div>
          <Form onSubmit={handleSignIn} className="section">
            <FormField
              autoFocus
              placeholder={__('yourstruly@example.com')}
              type="email"
              name="sign_in_email"
              label={__('Email')}
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <FormField
              type={showPass ? 'text' : 'password'}
              name="root_password"
              inputButton={
                <>
                  <Button
                    icon={showPass ? ICONS.EYE : ICONS.EYE_OFF}
                    onClick={() => setShowPass(!showPass)}
                    className={'editable-text__input-button'}
                  />
                </>
              }
              label={__('Password Again')}
              value={pass}
              onChange={(e) => setPass(e.target.value)}
            />
            <div className="section__actions">
              <Button button="primary" type="submit" label={__('Submit')} disabled={!email} />
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
    />
  );

  const signUpCard = (
    <Card
      title={__('Sign Up')}
      subtitle={
        <>
          <p>
            <I18nMessage
              tokens={{
                sign_in: <Button button="link" onClick={() => setMode(SIGN_UP_MODE)} label={__('Sign in')} />,
              }}
            >
              Sign up for a sync account. Or %sign_in%.
            </I18nMessage>
          </p>
        </>
      }
      actions={
        <div>
          <Form onSubmit={handleSignUp} className="section">
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
              name="root_password"
              inputButton={
                <>
                  <Button
                    icon={showPass ? ICONS.EYE : ICONS.EYE_OFF}
                    onClick={() => setShowPass(!showPass)}
                    className={'editable-text__input-button'}
                  />
                </>
              }
              label={__('Password Again')}
              value={pass}
              onChange={(e) => setPass(e.target.value)}
            />
            <div className="section__actions">
              <Button button="primary" type="submit" label={__('Submit')} disabled={!email} />
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
    />
  );

  return (
    <Page
      noFooter
      noSideNavigation
      // settingsPage
      className="card-stack"
      backout={{ title: __('Wallet Sync'), backLabel: __('Back') }}
    >
      <div className="card-stack">
        {mode === DONE_MODE && <>{doneCard}</>}
        {mode === SIGN_IN_MODE && <>{signInCard}</>}
        {mode === SIGN_UP_MODE && <>{signUpCard}</>}
        {mode === MATH_MODE && <>{deriveCard}</>}
        {mode === VERIFY_MODE && <>{verifyCard}</>}
      </div>
    </Page>
  );
}
