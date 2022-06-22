// @flow
import * as PAGES from 'constants/pages';
import * as ICONS from 'constants/icons';
import * as CS from 'constants/claim_search';
import { ENABLE_NO_SOURCE_CLAIMS } from 'config';
import React from 'react';
import ChannelsFollowingDiscoverPage from 'page/channelsFollowingDiscover';
import ClaimListDiscover from 'component/claimListDiscover';
import Page from 'component/page';
import Button from 'component/button';
import Icon from 'component/common/icon';
import { splitBySeparator } from 'util/lbryURI';

type Props = {
  subscribedChannels: Array<Subscription>,
  tileLayout: boolean,
};

function ChannelsFollowingPage(props: Props) {
  const { subscribedChannels, tileLayout } = props;

  const hasSubsribedChannels = subscribedChannels.length > 0;
  const channelIds = subscribedChannels.map((sub) => splitBySeparator(sub.uri)[1]);

  return !hasSubsribedChannels ? (
    <ChannelsFollowingDiscoverPage />
  ) : (
    <Page noFooter fullWidthPage={tileLayout}>
      <ClaimListDiscover
        tileLayout={tileLayout}
        headerLabel={
          <span>
            <Icon icon={ICONS.SUBSCRIBE} size={10} />
            {__('Following')}
          </span>
        }
        defaultOrderBy={CS.ORDER_BY_NEW}
        channelIds={channelIds}
        meta={
          <Button
            icon={ICONS.SEARCH}
            button="secondary"
            label={__('Discover Channels')}
            navigate={`/$/${PAGES.CHANNELS_FOLLOWING_DISCOVER}`}
          />
        }
        showNoSourceClaims={ENABLE_NO_SOURCE_CLAIMS}
        hasSource
      />
    </Page>
  );
}

export default ChannelsFollowingPage;
