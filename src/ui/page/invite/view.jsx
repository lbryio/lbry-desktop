// @flow
import React from 'react';
import BusyIndicator from 'component/common/busy-indicator';
import InviteNew from 'component/inviteNew';
import InviteList from 'component/inviteList';
import Page from 'component/page';

type Props = {
  isPending: boolean,
  isFailed: boolean,
  inviteAcknowledged: boolean,
  acknowledgeInivte: () => void,
  fetchInviteStatus: () => void,
};

class InvitePage extends React.PureComponent<Props> {
  componentDidMount() {
    const { fetchInviteStatus, inviteAcknowledged, acknowledgeInivte } = this.props;
    fetchInviteStatus();

    if (!inviteAcknowledged) {
      acknowledgeInivte();
    }
  }

  render() {
    const { isPending, isFailed } = this.props;

    return (
      <Page>
        {isPending && <BusyIndicator message={__('Checking your invite status')} />}
        {!isPending && isFailed && <span className="empty">{__('Failed to retrieve invite status.')}</span>}
        {!isPending && !isFailed && (
          <React.Fragment>
            {' '}
            <InviteNew />
            <InviteList />
          </React.Fragment>
        )}
      </Page>
    );
  }
}

export default InvitePage;
