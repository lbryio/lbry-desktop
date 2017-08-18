import React from "react";
import { BusyMessage } from "component/common";
import SubHeader from "component/subHeader";
import InviteNew from "component/inviteNew";
import InviteList from "component/inviteList";

class InvitePage extends React.PureComponent {
  componentWillMount() {
    this.props.fetchInviteStatus();
  }

  render() {
    const { isPending, isFailed } = this.props;

    return (
      <main className="main--single-column">
        <SubHeader />
        {isPending &&
          <BusyMessage message={__("Checking your invite status")} />}
        {!isPending &&
          isFailed &&
          <span className="empty">
            {__("Failed to retrieve invite status.")}
          </span>}
        {!isPending && !isFailed && <InviteNew />}
        {!isPending && !isFailed && <InviteList />}
      </main>
    );
  }
}

export default InvitePage;
