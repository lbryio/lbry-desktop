// @flow
import * as PAGES from 'constants/pages';
import * as ICONS from 'constants/icons';
import { ORDER_BY_NEW } from 'constants/claim_search';
import React from 'react';
import ChannelsFollowingDiscoverPage from 'page/channelsFollowingDiscover';
import ClaimListDiscover from 'component/claimListDiscover';
import Page from 'component/page';
import Button from 'component/button';
import Icon from 'component/common/icon';

type Props = {
  subscribedChannels: Array<Subscription>,
  tileLayout: boolean,
};

function ChannelsFollowingPage(props: Props) {
  const { subscribedChannels, tileLayout } = props;
  const hasSubsribedChannels = subscribedChannels.length > 0;

  return !hasSubsribedChannels ? (
    <ChannelsFollowingDiscoverPage />
  ) : (
    <Page noFooter fullWidthPage={tileLayout}>
      <ClaimListDiscover
        hideAdvancedFilter
        tileLayout={tileLayout}
        headerLabel={
          <span>
            <Icon icon={ICONS.SUBSCRIBE} size={10} />
            {__('Following')}
          </span>
        }
        defaultOrderBy={ORDER_BY_NEW}
        channelIds={subscribedChannels.map(sub => sub.uri.split('#')[1])}
        meta={
          <Button
            icon={ICONS.SEARCH}
            button="secondary"
            label={__('Discover Channels')}
            navigate={`/$/${PAGES.CHANNELS_FOLLOWING_DISCOVER}`}
          />
        }
      />
    </Page>
  );
}

export default ChannelsFollowingPage;
