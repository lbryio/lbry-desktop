import React from "react";
import { BusyMessage } from "component/common";
import UserEmailNew from "component/userEmailNew";
import UserEmailVerify from "component/userEmailVerify";
import UserVerify from "component/userVerify";

export class AuthPage extends React.PureComponent {
  /*
   <div className="card__title-primary">
   {newUserReward &&
   <CreditAmount amount={newUserReward.reward_amount} />}
   <h3>Welcome to LBRY</h3>
   </div>
   <div className="card__content">
   <p>
   {" "}{__(
   "Claim your welcome credits to be able to publish content, pay creators, and have a say over the LBRY network."
   )}
   </p>
   </div>
   <div className="card__content"><Auth /></div>
   */
  componentWillMount() {
    console.log("will mount");
    this.navigateIfAuthenticated(this.props);
  }

  componentWillReceiveProps(nextProps) {
    console.log("will receive");
    this.navigateIfAuthenticated(nextProps);
  }

  navigateIfAuthenticated(props) {
    const { isPending, user } = props;
    console.log(props);
    if (
      !isPending &&
      user &&
      user.has_verified_email &&
      user.is_identity_verified
    ) {
      props.onAuthComplete();
    }
  }

  getTitle() {
    const { email, isPending, isVerificationCandidate, user } = this.props;

    if (isPending || (user && !user.has_verified_email && !email)) {
      return __("Welcome to LBRY");
    } else if (user && !user.has_verified_email) {
      return __("Confirm Email");
    } else if (user && !user.is_identity_verified) {
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
    const { email, hasEmail, isPending } = this.props;

    return (
      <main className="">
        <section className="card card--form">
          <div className="card__title-primary">
            <h1>{this.getTitle()}</h1>
          </div>
          <div className="card__content">
            {!isPending &&
              !email &&
              !hasEmail &&
              <p>
                {__("Create a verified identity and receive LBC rewards.")}
              </p>}
            {this.renderMain()}
          </div>
          <div className="card__content">
            <div className="help">
              {__(
                "This information is disclosed only to LBRY, Inc. and not to the LBRY network. It is collected to provide communication and prevent abuse."
              )}
            </div>
          </div>
        </section>
      </main>
    );
  }
}

export default AuthPage;
