import * as PAGES from "constants/pages";
import React, { useState } from "react";
import { withRouter } from "react-router";
import Page from "component/page";
import ReCAPTCHA from "react-google-recaptcha";
import Button from "component/button";
import { Lbryio } from "lbryinc";
import I18nMessage from "component/i18nMessage";
import Card from "component/common/card";
type Props = {
  history: {
    push: (arg1: string) => void;
    location: {
      search: string;
    };
  };
  doToast: (arg1: Record<any, any>) => void;
};

function SignInVerifyPage(props: Props) {
  const {
    history: { push, location },
    doToast,
  } = props;
  const [isAuthenticationSuccess, setIsAuthenticationSuccess] = useState(false);
  // Google's reCAPTCHA is only loaded after the user agrees to it (#607).
  const [captchaAccepted, setCaptchaAccepted] = useState(false);
  const [showCaptchaMessage, setShowCaptchaMessage] = useState(false);
  const [captchaLoaded, setCaptchaLoaded] = useState(false);
  // The sign-in link is single use, so confirm it at most once. A second
  // confirm fails and would report an error after a successful sign-in.
  const confirmStarted = React.useRef(false);
  const urlParams = new URLSearchParams(location.search);
  const authToken = urlParams.get("auth_token");
  const userSubmittedEmail = urlParams.get("email");
  const verificationToken = urlParams.get("verification_token");
  const needsRecaptcha = urlParams.get("needs_recaptcha") === "true";
  const isLinkValid = Boolean(authToken && userSubmittedEmail && verificationToken);
  const showCaptchaConsent = needsRecaptcha && !captchaAccepted && !isAuthenticationSuccess;

  function onAuthError(message?: unknown) {
    doToast({
      message: message || __("Authentication failure."),
      isError: true,
    });
    push(`/$/${PAGES.AUTH}`);
  }

  function verifyUser(captchaValue?: unknown) {
    if (confirmStarted.current) return;
    confirmStarted.current = true;

    // @ts-expect-error - TS2339 (ts-migration)
    Lbryio.call("user_email", "confirm", {
      auth_token: authToken,
      email: userSubmittedEmail,
      verification_token: verificationToken,
      ...(captchaValue ? { recaptcha: captchaValue } : {}),
    })
      .then(() => {
        setIsAuthenticationSuccess(true);
      })
      .catch(() => {
        onAuthError(__("Invalid captcha response or other authentication error."));
      });
  }

  // The link comes from the URL the page opened with, so check it once.
  React.useEffect(() => {
    if (!isLinkValid) {
      onAuthError(__("Invalid or expired sign-in link."));
    } else if (!needsRecaptcha) {
      verifyUser();
    }
  }, []);

  React.useEffect(() => {
    let captchaTimeout;

    if (captchaAccepted && !captchaLoaded) {
      captchaTimeout = setTimeout(() => {
        setShowCaptchaMessage(true);
      }, 2000);
    }

    return () => {
      if (captchaTimeout) {
        clearTimeout(captchaTimeout);
      }
    };
  }, [captchaAccepted, captchaLoaded]);

  function onCaptchaChange(value: unknown) {
    verifyUser(value);
  }

  function onCaptchaReady() {
    setCaptchaLoaded(true);
  }

  function getSubtitle() {
    if (isAuthenticationSuccess) return __("You can now close this tab.");
    if (showCaptchaConsent) {
      return __(
        "To finish signing in, the sign-in server asks for a Google reCAPTCHA check. Loading it sends your IP address and browser details to Google."
      );
    }
    if (needsRecaptcha) return null;
    return __("Welcome back! You are automatically being signed in.");
  }

  function getActions() {
    if (isAuthenticationSuccess || !needsRecaptcha || !isLinkValid) return null;

    if (showCaptchaConsent) {
      return (
        <div className="section__actions">
          <Button
            // @ts-expect-error - TS2322 (ts-migration)
            button="primary"
            label={__("Continue with Google reCAPTCHA")}
            onClick={() => setCaptchaAccepted(true)}
          />
          {/* @ts-expect-error - TS2322 (ts-migration) */}
          <Button button="link" label={__("Cancel")} onClick={() => push(`/$/${PAGES.AUTH}`)} />
        </div>
      );
    }

    return (
      <div className="section__actions">
        <ReCAPTCHA
          sitekey="6LePsJgUAAAAAFTuWOKRLnyoNKhm0HA4C3elrFMG"
          onChange={onCaptchaChange}
          asyncScriptOnLoad={onCaptchaReady}
          onExpired={onAuthError}
          onErrored={onAuthError}
        />
      </div>
    );
  }

  return (
    // @ts-expect-error - TS2322 (ts-migration)
    <Page authPage noFooter>
      <div className="main__sign-up">
        <Card
          title={isAuthenticationSuccess ? __("Log in success!") : __("Log in")}
          subtitle={
            <React.Fragment>
              <p>{getSubtitle()}</p>
              {showCaptchaMessage && !isAuthenticationSuccess && (
                <p>
                  {/* @ts-expect-error - TS2745 (ts-migration) */}
                  <I18nMessage
                    // @ts-expect-error - TS2322 (ts-migration)
                    tokens={{
                      refresh: (
                        // @ts-expect-error - TS2322 (ts-migration)
                        <Button button="link" label={__("refreshing")} onClick={() => window.location.reload()} />
                      ),
                    }}
                  >
                    Not seeing a captcha? Check your ad blocker or try %refresh%.
                  </I18nMessage>
                </p>
              )}
            </React.Fragment>
          }
          actions={getActions()}
        />
      </div>
    </Page>
  );
}

export default withRouter(SignInVerifyPage);
