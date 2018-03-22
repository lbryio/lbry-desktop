import React from 'react';
import BusyIndicator from 'component/common/busy-indicator';
import InviteNew from 'component/inviteNew';
import InviteList from 'component/inviteList';
import Page from 'component/page';

class InvitePage extends React.PureComponent {
  componentWillMount() {
    this.props.fetchInviteStatus();
  }

  render() {
    const { isPending, isFailed } = this.props;

    return (
      <Page>
        {isPending && <BusyIndicator message={__('Checking your invite status')} />}
        {!isPending &&
          isFailed && <span className="empty">{__('Failed to retrieve invite status.')}</span>}
        {!isPending &&
          !isFailed && (
            <React.Fragment>
              <InviteNew />
              <InviteList />
            </React.Fragment>
          )}
      </Page>
    );
  }
}

export default InvitePage;
