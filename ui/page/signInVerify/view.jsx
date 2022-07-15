// @flow
import React, { useState } from 'react';
import { withRouter } from 'react-router';
import Page from 'component/page';
import ReCAPTCHA from 'react-google-recaptcha';
import Button from 'component/button';
import { Lbryio } from 'lbryinc';
import I18nMessage from 'component/i18nMessage';
import Card from 'component/common/card';

type Props = {
  history: { push: (string) => void, location: { search: string } },
  doToast: ({}) => void,
};

// Guard against parents remounting. We don't want to send multi api calls.
let verificationApiHistory = { called: false, successful: false };

function SignInVerifyPage(props: Props) {
  const {
    history: { push, location },
    doToast,
  } = props;

  const [isAuthenticationSuccess, setIsAuthenticationSuccess] = useState(verificationApiHistory.successful);
  const [showCaptchaMessage, setShowCaptchaMessage] = useState(false);
  const [captchaLoaded, setCaptchaLoaded] = useState(false);
  const urlParams = new URLSearchParams(location.search);
  const authToken = urlParams.get('auth_token');
  const userSubmittedEmail = urlParams.get('email');
  const verificationToken = urlParams.get('verification_token');
  const needsRecaptcha = urlParams.get('needs_recaptcha') === 'true';

  const successful = isAuthenticationSuccess || verificationApiHistory.successful;

  function onAuthError(message) {
    doToast({
      message: message || __('Authentication failure.'),
      isError: true,
    });
  }

  React.useEffect(() => {
    if (!authToken || !userSubmittedEmail || !verificationToken) {
      onAuthError(__('Invalid or expired sign-in link.'));
    }
  }, [authToken, userSubmittedEmail, verificationToken, doToast, push]);

  React.useEffect(() => {
    if (!needsRecaptcha && !isAuthenticationSuccess && !verificationApiHistory.called) {
      verifyUser();
    }
    // (on mount only)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  React.useEffect(() => {
    let captchaTimeout;

    if (needsRecaptcha && !captchaLoaded) {
      captchaTimeout = setTimeout(() => {
        setShowCaptchaMessage(true);
      }, 2000);
    }

    return () => {
      if (captchaTimeout) {
        clearTimeout(captchaTimeout);
      }
    };
  }, [needsRecaptcha, captchaLoaded]);

  function onCaptchaChange(value) {
    verifyUser(value);
  }

  function onCaptchaReady() {
    setCaptchaLoaded(true);
  }

  function verifyUser(captchaValue) {
    verificationApiHistory.called = true;
    Lbryio.call('user_email', 'confirm', {
      auth_token: authToken,
      email: userSubmittedEmail,
      verification_token: verificationToken,
      ...(captchaValue ? { recaptcha: captchaValue } : {}),
    })
      .then(() => {
        verificationApiHistory.successful = true;
        setIsAuthenticationSuccess(true);
      })
      .catch(() => {
        verificationApiHistory.successful = false;
        onAuthError(__('Invalid captcha response or other authentication error.'));
      });
  }

  return (
    <Page authPage noFooter>
      <div className="main__sign-up">
        <Card
          title={successful ? __('Log in success!') : __('Log in')}
          subtitle={
            <React.Fragment>
              <p>
                {successful
                  ? __('You can now close this tab.')
                  : needsRecaptcha
                  ? null
                  : __('Welcome back! You are automatically being signed in.')}
              </p>
              {showCaptchaMessage && !successful && (
                <p>
                  <I18nMessage
                    tokens={{
                      refresh: (
                        <Button button="link" label={__('refreshing')} onClick={() => window.location.reload()} />
                      ),
                    }}
                  >
                    Not seeing a captcha? Check your ad blocker or try %refresh%.
                  </I18nMessage>
                </p>
              )}
            </React.Fragment>
          }
          actions={
            !successful &&
            needsRecaptcha && (
              <div className="section__actions">
                <ReCAPTCHA
                  sitekey="6LePsJgUAAAAAFTuWOKRLnyoNKhm0HA4C3elrFMG"
                  onChange={onCaptchaChange}
                  asyncScriptOnLoad={onCaptchaReady}
                  onExpired={onAuthError}
                  onErrored={onAuthError}
                />
              </div>
            )
          }
        />
      </div>
    </Page>
  );
}

export default withRouter(SignInVerifyPage);
