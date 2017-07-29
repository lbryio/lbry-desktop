import React from "react";
import { BusyMessage } from "component/common";
import Link from "component/link";
import UserEmailNew from "component/userEmailNew";
import UserEmailVerify from "component/userEmailVerify";
import UserVerify from "component/userVerify";

export class AuthPage extends React.PureComponent {
  componentWillMount() {
    this.navigateIfAuthenticated(this.props);
  }

  componentWillReceiveProps(nextProps) {
    this.navigateIfAuthenticated(nextProps);
  }

  navigateIfAuthenticated(props) {
    const { isPending, user } = props;
    if (
      !isPending &&
      user &&
      user.has_verified_email &&
      (user.is_reward_approved || user.is_identity_verified)
    ) {
      props.navigate(props.pathAfterAuth);
    }
  }

  getTitle() {
    const { email, isPending, isVerificationCandidate, user } = this.props;

    if (isPending || (user && !user.has_verified_email && !email)) {
      return __("Welcome to LBRY");
    } else if (user && !user.has_verified_email) {
      return __("Confirm Email");
    } else if (user && !user.is_identity_verified && !user.is_reward_approved) {
      return __("Confirm Identity");
    } else {
      return __("Welcome to LBRY");
    }
  }

  renderMain() {
    const { email, isPending, isVerificationCandidate, user } = this.props;

    if (isPending) {
      return <BusyMessage message={__("Authenticating")} />;
    } else if (user && !user.has_verified_email && !email) {
      return <UserEmailNew />;
    } else if (user && !user.has_verified_email) {
      return <UserEmailVerify />;
    } else if (user && !user.is_identity_verified) {
      return <UserVerify />;
    } else {
      return <span className="empty">{__("No further steps.")}</span>;
    }
  }

  render() {
    const { email, user, isPending, navigate } = this.props;

    return (
      <main className="">
        <section className="card card--form">
          <div className="card__title-primary">
            <h1>{this.getTitle()}</h1>
          </div>
          <div className="card__content">
            {!isPending &&
              !email &&
              !user.has_verified_email &&
              <p>
                {__("Create a verified identity and receive LBC rewards.")}
              </p>}
            {this.renderMain()}
          </div>
          <div className="card__content">
            <div className="help">
              {__(
                "This information is disclosed only to LBRY, Inc. and not to the LBRY network. It is only required to earn LBRY rewards."
              ) + " "}
              <Link
                onClick={() => navigate("/discover")}
                label={__("Return home")}
              />.
            </div>
          </div>
        </section>
      </main>
    );
  }
}

export default AuthPage;
