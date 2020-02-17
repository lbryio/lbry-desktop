// @flow
import * as PAGES from 'constants/pages';
import * as ICONS from 'constants/icons';
import React from 'react';
import ChannelsFollowingDiscoverPage from 'page/channelsFollowingDiscover';
import ClaimListDiscover from 'component/claimListDiscover';
import Page from 'component/page';
import Button from 'component/button';
import Icon from 'component/common/icon';

import { TYPE_NEW } from 'component/claimListDiscover/view';

type Props = {
  subscribedChannels: Array<Subscription>,
};

function ChannelsFollowingPage(props: Props) {
  const { subscribedChannels } = props;
  const hasSubsribedChannels = subscribedChannels.length > 0;

  return !hasSubsribedChannels ? (
    <ChannelsFollowingDiscoverPage />
  ) : (
    <Page>
      <ClaimListDiscover
        headerLabel={
          <span>
            <Icon icon={ICONS.SUBSCRIBE} size={10} />
            {__('Following')}
          </span>
        }
        defaultTypeSort={TYPE_NEW}
        channelIds={subscribedChannels.map(sub => sub.uri.split('#')[1])}
        meta={
          <Button
            icon={ICONS.SEARCH}
            button="link"
            label={__('Discover New Channels')}
            navigate={`/$/${PAGES.CHANNELS_FOLLOWING_DISCOVER}`}
          />
        }
      />
    </Page>
  );
}

export default ChannelsFollowingPage;
