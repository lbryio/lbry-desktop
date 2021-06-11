// @flow
// import * as ICONS from 'constants/icons';
// import * as PAGES from 'constants/pages';
import * as CS from 'constants/claim_search';
import React from 'react';
import Page from 'component/page';
// import Button from 'component/button';
import ClaimListDiscover from 'component/claimListDiscover';
// import { toCapitalCase } from 'util/string';
import { CUSTOM_HOMEPAGE } from 'config';

const MORE_CHANNELS_ANCHOR = 'MoreChannels';

type Props = {
  followedTags: Array<Tag>,
  subscribedChannels: Array<Subscription>,
  blockedChannels: Array<string>,
  homepageData: any,
};

function ChannelsFollowingDiscover(props: Props) {
  const { followedTags, subscribedChannels, blockedChannels, homepageData } = props;
  const { PRIMARY_CONTENT } = homepageData;
  let channelIds;
  if (PRIMARY_CONTENT && CUSTOM_HOMEPAGE) {
    channelIds = PRIMARY_CONTENT.channelIds;
  }
  let rowData: Array<ChannelsFollowingItem> = [];
  const notChannels = subscribedChannels
    .map(({ uri }) => uri)
    .concat(blockedChannels)
    .map((uri) => uri.split('#')[1]);



  return (
    <Page>
      <ClaimListDiscover
        defaultOrderBy={CS.ORDER_BY_TRENDING}
        defaultFreshness={CS.FRESH_ALL}
        claimType={CS.CLAIM_CHANNEL}
        claimIds={CUSTOM_HOMEPAGE && channelIds ? channelIds : undefined}
        scrollAnchor={MORE_CHANNELS_ANCHOR}
        maxPages={3}
        hideFilters
        header={<h1 className="section__title">{__('Moon cheese is an acquired taste')}</h1>}
      />
    </Page>
  );
}

export default ChannelsFollowingDiscover;
