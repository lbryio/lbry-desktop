// @flow
import { SITE_NAME } from 'config';
import React from 'react';
import BusyIndicator from 'component/common/busy-indicator';
import InviteNew from 'component/inviteNew';
import InviteList from 'component/inviteList';
import Page from 'component/page';
import RewardAuthIntro from 'component/rewardAuthIntro';

type Props = {
  isPending: boolean,
  isFailed: boolean,
  inviteAcknowledged: boolean,
  authenticated: boolean,
  acknowledgeInivte: () => void,
  fetchInviteStatus: (boolean) => void,
};

class InvitePage extends React.PureComponent<Props> {
  componentDidMount() {
    const { fetchInviteStatus, inviteAcknowledged, acknowledgeInivte } = this.props;
    fetchInviteStatus(false);

    if (!inviteAcknowledged) {
      acknowledgeInivte();
    }
  }

  render() {
    const { isPending, isFailed, authenticated } = this.props;

    return (
      <Page>
        {!authenticated ? (
          <RewardAuthIntro
            title={__('Log in to %SITE_NAME% to earn rewards From Inviting Your Friends', { SITE_NAME })}
          />
        ) : (
          <React.Fragment>
            {isPending && <BusyIndicator message={__('Checking your invite status')} />}
            {!isPending && isFailed && <span className="empty">{__('Failed to retrieve invite status.')}</span>}
            {!isPending && !isFailed && (
              <React.Fragment>
                <InviteNew />
                <InviteList />
              </React.Fragment>
            )}
          </React.Fragment>
        )}
      </Page>
    );
  }
}

export default InvitePage;
