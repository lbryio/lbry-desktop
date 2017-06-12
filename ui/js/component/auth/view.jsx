import React from "react";
import { BusyMessage } from "component/common";
import UserEmailNew from "component/userEmailNew";
import UserEmailVerify from "component/userEmailVerify";

export class Auth extends React.PureComponent {
  render() {
    const { isPending, email, isVerificationCandidate } = this.props;

    if (isPending) {
      return <BusyMessage message={__("Authenticating")} />;
    } else if (!email) {
      return <UserEmailNew />;
    } else if (isVerificationCandidate) {
      return <UserEmailVerify />;
    } else {
      return <span className="empty">{__("No further steps.")}</span>;
    }
  }
}

export default Auth;
