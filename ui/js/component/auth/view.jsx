import React from "react";
import { BusyMessage } from "component/common";
import UserEmailNew from "component/userEmailNew";
import UserEmailVerify from "component/userEmailVerify";
import UserVerify from "component/userVerify";

export class Auth extends React.PureComponent {
  render() {
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
}

export default Auth;
