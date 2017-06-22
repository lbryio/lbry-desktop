import React from "react";
import lbryio from "lbryio.js";
import ModalPage from "component/modal-page.js";
import Auth from "component/auth";
import Link from "component/link";
import { getLocal, setLocal } from "utils";

export class AuthOverlay extends React.PureComponent {
  constructor(props) {
    super(props);

    this.state = {
      showNoEmailConfirm: false,
    };
  }

  componentWillReceiveProps(nextProps) {
    if (
      this.props.isShowing &&
      !this.props.isPending &&
      !nextProps.isShowing /* && !getLocal("welcome_screen_shown")*/
    ) {
      setLocal("welcome_screen_shown", true);
      setTimeout(() => this.props.openWelcomeModal(), 1);
    }
  }

  onEmailSkipClick() {
    this.setState({ showNoEmailConfirm: true });
  }

  onEmailSkipConfirm() {
    this.props.userEmailDecline();
  }

  render() {
    if (!lbryio.enabled) {
      return null;
    }

    const { isPending, isShowing, hasEmail } = this.props;

    if (isShowing) {
      return (
        <ModalPage
          className="modal-page--full"
          isOpen={true}
          contentLabel="Authentication"
        >
          <h1>LBRY Early Access</h1>
          <Auth />
          {isPending
            ? ""
            : <div className="form-row-submit">
                {!hasEmail && this.state.showNoEmailConfirm
                  ? <div className="help form-input-width">
                      <p>
                        {__(
                          "If you continue without an email, you will be ineligible to earn free LBC rewards, as well as unable to receive security related communications."
                        )}
                      </p>
                      <Link
                        onClick={() => {
                          this.onEmailSkipConfirm();
                        }}
                        label={__("Continue without email")}
                      />
                    </div>
                  : <Link
                      className={"button-text-help"}
                      onClick={() => {
                        hasEmail
                          ? this.onEmailSkipConfirm()
                          : this.onEmailSkipClick();
                      }}
                      label={
                        hasEmail ? __("Skip for now") : __("Do I have to?")
                      }
                    />}
              </div>}
        </ModalPage>
      );
    }

    return null;
  }
}

export default AuthOverlay;
