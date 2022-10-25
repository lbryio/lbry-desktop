// @flow
import * as React from 'react';
import Page from 'component/page';
import Card from 'component/common/card';
import Button from 'component/button';
import { Form, FormField } from 'component/common/form';
import I18nMessage from 'component/i18nMessage';
import * as ICONS from 'constants/icons';

type Props = {
  walletEncrypted: boolean,
  encryptWallet: (string) => void,
  decryptWallet: (string) => void,
  registering: boolean,
  registerError: string,
  token: string,
  authenticating: boolean,
  authError: string,
  derivingKeys: boolean,
  encHmacKey: string, // ?
  encRootPass: string,
  encProviderPass: string,
  getSalt: (string) => void,
  deriveSecrets: (string, string, string) => void, // something

  // begin
  // email
  handleEmail: (string, string) => void, // return something?
  checkingEmail: boolean,
  candidateEmail?: string,
  registeredEmail?: string,
  saltSeed: string,
  emailError: string,
  // password/register
  register: (string) => void,
  waitForVerify: () => void,
};

export default function SettingsSyncPage(props: Props) {
  // const {  } = props;
  const {
    registering,
    registerError,
    token,
    authenticating,
    authError,
    authenticate,
    encRootPass,
    register,
    // begin
    // .. email
    registeredEmail,
    handleEmail,
    checkingEmail,
    candidateEmail,
    saltSeed,
    emailError,
    // password
    // verify
    waitForVerify,
  } = props;

  /*
    Register / auth
   */

  // modes
  const SIGN_IN_MODE = 'sign_in_mode';
  const SIGN_UP_MODE = 'sign_up_mode';
  const [mode, setMode] = React.useState(SIGN_IN_MODE);
  // steps
  const EMAIL_SCREEN = 'sign_in'; // show email input
  // checking email
  const PASSWORD_SCREEN = 'password'; // show password input
  // registering
  const REGISTERING_SCREEN = 'register'; // show working page for deriving passwords, registering
  const VERIFY_SCREEN = 'verify'; // show waiting for email verification
  // waiting for email verification
  const SYNC_SCREEN = 'sync';
  // syncing wallet with server
  const DONE_SCREEN = 'done';

  const [email, setEmail] = React.useState();
  const [pass, setPass] = React.useState();
  const [showPass, setShowPass] = React.useState(false);

  let STEP;
  if (!candidateEmail) {
    STEP = EMAIL_SCREEN; // present email form, on submit check email salt
  } else if (!encRootPass && !registering) {
    // make this "hasPasswords"
    STEP = PASSWORD_SCREEN; // present password form, on submit derive keys and register
  } else if (registering) {
    STEP = REGISTERING_SCREEN;
  } else if (encRootPass && !token) {
    STEP = VERIFY_SCREEN; // until token
  } else if (token) {
    STEP = SYNC_SCREEN;
  }

  // error comes from store
  // const [error, setError] = React.useState('');

  React.useEffect(() => {
    if (registeredEmail && !token) {
      waitForVerify();
    }

    return () => {
      waitForVerify(true);
    };
  }, [registeredEmail, token]);

  React.useEffect(() => {
    if (token) {
      // sign up
      // what
      // pushAndStart();
      // what
      //
    }
  }, [token]);

  const handleRegister = (e) => {
    register(pass);
  };

  const handleSignUpEmail = async () => {
    // get salt for email to make sure email doesn't exist
    handleEmail(email, true);
  };

  const handleSignInEmail = () => {
    handleEmail(email, false);
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

  const registerCard = (
    <Card title={__('Registering')} subtitle={__('Hold on a moment, signing you up.')} actions={<div>Math...</div>} />
  );

  const syncCard = (
    <Card
      title={__('Syncing With Server')}
      subtitle={__(`Great. Now we're syncing your wallet.`)}
      actions={<div>Math...</div>}
    />
  );

  const signInEmailCard = (
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
          <Form onSubmit={handleSignInEmail} className="section">
            <FormField
              autoFocus
              placeholder={__('yourstruly@example.com')}
              type="email"
              name="sign_in_email"
              label={__('Email')}
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              helper={emailError && emailError}
            />
            <FormField
              type={'text'}
              name="sync_provider"
              disabled
              label={__('Sync Provider Url')}
              value={'https://dev.lbry.id'}
              onChange={(e) => setPass(e.target.value)}
            />
            <div className="section__actions">
              <Button button="primary" type="submit" label={__('Submit')} disabled={checkingEmail} />
            </div>
            <p className="help--card-actions">
              <I18nMessage
                tokens={{
                  terms: <Button button="link" href="https://www.lbry.com/termsofservice" label={__('terms')} />,
                }}
              >
                Some sign-in relevant message.
              </I18nMessage>
            </p>
          </Form>
        </div>
      }
    />
  );

  const signUpEmailCard = (
    <Card
      title={__('Sign Up')}
      subtitle={
        <>
          <p>
            <I18nMessage
              tokens={{
                sign_in: <Button button="link" onClick={() => setMode(SIGN_IN_MODE)} label={__('Sign in')} />,
              }}
            >
              Sign up for a sync account. Or %sign_in%.
            </I18nMessage>
          </p>
        </>
      }
      actions={
        <div>
          <Form onSubmit={handleSignUpEmail} className="section">
            <FormField
              autoFocus
              placeholder={__('yourstruly@example.com')}
              type="email"
              name="sign_up_email"
              label={__('Email')}
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              helper={emailError && emailError}
            />
            <FormField
              type={'text'}
              name="sync_provider"
              disabled
              label={__('Sync Provider Url')}
              value={'https://dev.lbry.id'}
              onChange={(e) => setPass(e.target.value)}
            />
            <div className="section__actions">
              <Button button="primary" type="submit" label={__('Submit')} disabled={checkingEmail} />
            </div>
          </Form>
        </div>
      }
    />
  );

  const passwordCard = (
    <Card
      title={__('Enter Password')}
      subtitle={
        <>
          <p>
            <I18nMessage
              tokens={{
                sign_in: <Button button="link" onClick={() => setMode(EMAIL_SCREEN)} label={__('Sign in')} />,
              }}
            >
              Enter a password.
            </I18nMessage>
          </p>
        </>
      }
      actions={
        <div>
          <fieldset-section className="section">
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
              label={__('Password')}
              value={pass}
              onChange={(e) => setPass(e.target.value)}
            />
            <div className="section__actions">
              <Button button="primary" label={__('Submit')} onClick={handleRegister} />{' '}
              {/* password input validation */}
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
          </fieldset-section>
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
        {STEP === EMAIL_SCREEN && mode === SIGN_IN_MODE && <>{signInEmailCard}</>}
        {STEP === EMAIL_SCREEN && mode === SIGN_UP_MODE && <>{signUpEmailCard}</>}
        {STEP === PASSWORD_SCREEN && <>{passwordCard}</>}
        {STEP === REGISTERING_SCREEN && <>{registerCard}</>}
        {STEP === VERIFY_SCREEN && <>{verifyCard}</>}
        {STEP === SYNC_SCREEN && <>{syncCard}</>}
      </div>
    </Page>
  );
}
