import React from "react";
import Button from "component/button";
import UserEmailNew from "component/userEmailNew";
import UserEmailVerify from "component/userEmailVerify";

type Props = {
  email: string;
  emailCollectionAcknowledged: boolean;
  user:
    | {
        has_verified_email: boolean;
      }
    | null
    | undefined;
  completeFirstRun: () => void;
  acknowledgeEmail: () => void;
};

class FirstRunEmailCollection extends React.PureComponent<Props> {
  render() {
    const { completeFirstRun, email, user, emailCollectionAcknowledged, acknowledgeEmail } = this.props;

    // this shouldn't happen
    if (!user) {
      return null;
    }

    // @ts-expect-error - TS2322 (ts-migration)
    const cancelButton = <Button button="link" onClick={completeFirstRun} label={__("Not Now")} />;
    if (user && !user.has_verified_email && !email) {
      // @ts-expect-error - TS2322 (ts-migration)
      return <UserEmailNew cancelButton={cancelButton} />;
    } else if (user && !user.has_verified_email) {
      // @ts-expect-error - TS2322 (ts-migration)
      return <UserEmailVerify cancelButton={cancelButton} />;
    }

    // Try to acknowledge here so users don't see an empty email screen in the first run banner
    if (!emailCollectionAcknowledged) {
      acknowledgeEmail();
    }

    return null;
  }
}

export default FirstRunEmailCollection;
