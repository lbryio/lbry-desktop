// @flow
import React, { useState } from 'react';
import { withRouter } from 'react-router';
import Page from 'component/page';
import ReCAPTCHA from "react-google-recaptcha";
import Button from 'component/button';
import { Lbryio } from 'lbryinc';
import * as PAGES from 'constants/pages';

type Props = {
  history: { push: string => void },
  doToast: ({}) => void
};

function SignInVerifyPage(props: Props) {
  const { history: { push }, doToast } = props;
  const urlParams = new URLSearchParams(location.search);
  const authToken = urlParams.get('auth_token');
  const userSubmittedEmail = urlParams.get('email');
  const verificationToken = urlParams.get('verification_token');

  const [isAuthenticationSuccess, setIsAuthenticationSuccess] = useState(false);

  function onAuthError(message) {
    doToast({
      message: message || __('Authentication failure.'),
      isError: true,
    });
    push(`/$/${PAGES.AUTH}`);
  }

  React.useEffect(() => {
    if (!authToken || !userSubmittedEmail || !verificationToken) {
      onAuthError(__('Invalid or expired sign-in link.'));
    }
  }, [authToken, userSubmittedEmail, verificationToken, doToast, push]);

  function onCaptchaChange(value) {
    Lbryio.call('user_email', 'confirm', {
      auth_token: authToken,
      email: userSubmittedEmail,
      verification_token: verificationToken,
      recaptcha: value,
    })
    .then(() => {
      setIsAuthenticationSuccess(true);
    })
    .catch(() => {
      onAuthError(__('Invalid captcha response or other authentication error.'));
    });
  }

  return (
    <Page authPage className="main--auth-page">
      <section className="main--contained">
        <h1 className="section__title--large">{isAuthenticationSuccess ? __('Sign In Success!') : __('Sign In to lbry.tv') }</h1>
        <p className="section__subtitle">{ isAuthenticationSuccess ?  __('You can now close this tab.') : __('Click below to sign in to lbry.tv') }</p>
        { !isAuthenticationSuccess &&
        <div className="section__actions">
          <ReCAPTCHA
          sitekey="6LePsJgUAAAAAFTuWOKRLnyoNKhm0HA4C3elrFMG"
          onChange={onCaptchaChange}
          onExpired={onAuthError}
          onErrored={onAuthError}
        />
        </div>}
      </section>
    </Page>
  );
};

export default withRouter(SignInVerifyPage);
