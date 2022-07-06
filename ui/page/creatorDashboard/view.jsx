// @flow
import * as PAGES from 'constants/pages';
import React from 'react';
import Page from 'component/page';
import Spinner from 'component/spinner';
import Button from 'component/button';
import CreatorAnalytics from 'component/creatorAnalytics';
import ChannelSelector from 'component/channelSelector';
import Yrbl from 'component/yrbl';

type Props = {
  hasChannels: boolean,
  fetchingChannels: boolean,
  activeChannelClaim: ?ChannelClaim,
};

export default function CreatorDashboardPage(props: Props) {
  const { hasChannels, fetchingChannels, activeChannelClaim } = props;

  return (
    <Page>
      {fetchingChannels && (
        <div className="main--empty">
          <Spinner delayed />
        </div>
      )}

      {!fetchingChannels && !hasChannels && (
        <Yrbl
          type="happy"
          title={__("You haven't created a channel yet, let's fix that!")}
          actions={
            <div className="section__actions">
              <Button button="primary" navigate={`/$/${PAGES.CHANNEL_NEW}`} label={__('Create A Channel')} />
            </div>
          }
        />
      )}

      {!fetchingChannels && activeChannelClaim && (
        <React.Fragment>
          <ChannelSelector hideAnon />
          <CreatorAnalytics uri={activeChannelClaim.canonical_url} />
        </React.Fragment>
      )}
    </Page>
  );
}
