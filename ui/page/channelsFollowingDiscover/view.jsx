// @flow
import React from 'react';
import Page from 'component/page';
import ClaimListDiscover from 'component/claimListDiscover';
import * as CS from 'constants/claim_search';
import { CUSTOM_HOMEPAGE, SIMPLE_SITE } from 'config';

const MORE_CHANNELS_ANCHOR = 'MoreChannels';

type Props = {
  subscribedChannels: Array<Subscription>,
  blockedChannels: Array<string>,
  homepageData: any,
  discoverData: ?Array<string>,
};

function ChannelsFollowingDiscover(props: Props) {
  const { /* subscribedChannels, */ homepageData, discoverData } = props;
  const { PRIMARY_CONTENT, LATEST } = homepageData;

  let channelIds;
  if (discoverData) {
    channelIds = discoverData;
  } else if (CUSTOM_HOMEPAGE) {
    if (LATEST) {
      channelIds = LATEST.channelIds;
    } else if (PRIMARY_CONTENT) {
      channelIds = PRIMARY_CONTENT.channelIds;
    }
  }

  return (
    <Page className="discoverPage-wrapper">
      <ClaimListDiscover
        defaultOrderBy={CS.ORDER_BY_TRENDING}
        defaultFreshness={CS.FRESH_ALL}
        claimType={CS.CLAIM_CHANNEL}
        claimIds={CUSTOM_HOMEPAGE && channelIds ? channelIds : undefined}
        scrollAnchor={MORE_CHANNELS_ANCHOR}
        maxPages={SIMPLE_SITE ? 3 : undefined}
        hideFilters={SIMPLE_SITE}
        header={SIMPLE_SITE ? <h1 className="section__title">{__('Moon cheese is an acquired taste')}</h1> : undefined}
      />
    </Page>
  );
}

export default ChannelsFollowingDiscover;
