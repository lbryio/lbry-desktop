// @flow
import * as ICONS from 'constants/icons';
import * as PAGES from 'constants/pages';
import React from 'react';
import Page from 'component/page';
import Button from 'component/button';
import ClaimTilesDiscover from 'component/claimTilesDiscover';
import ClaimListDiscover from 'component/claimListDiscover';
import * as CS from 'constants/claim_search';
import { toCapitalCase } from 'util/string';
import { SIMPLE_SITE } from 'config';

const MORE_CHANNELS_ANCHOR = 'MoreChannels';

type Props = {
  followedTags: Array<Tag>,
  subscribedChannels: Array<Subscription>,
  blockedChannels: Array<string>,
  homepageData: any,
};

type ChannelsFollowingItem = {
  title: string,
  link?: string,
  help?: any,
  options?: {},
};

function ChannelsFollowingDiscover(props: Props) {
  const { followedTags, subscribedChannels, blockedChannels, homepageData } = props;
  const { PRIMARY_CONTENT_CHANNEL_IDS } = homepageData;
  // let rowData: Array<ChannelsFollowingItem> = [];
  const notChannels = subscribedChannels
    .map(({ uri }) => uri)
    .concat(blockedChannels)
    .map(uri => uri.split('#')[1]);

  const getRowData = () => {
    const rData = [];
    rData.push({
      title: 'Top Channels Of All Time',
      link: `/$/${PAGES.DISCOVER}?claim_type=channel&${CS.ORDER_BY_KEY}=${CS.ORDER_BY_TOP}&${CS.FRESH_KEY}=${CS.FRESH_ALL}`,
      options: {
        pageSize: 12,
        claimType: 'channel',
        orderBy: ['effective_amount'],
        notChannels,
      },
    });

    rData.push({
      title: 'Latest From @lbrycast',
      link: `/@lbrycast:4`,
      options: {
        orderBy: ['release_time'],
        pageSize: 8,
        channelIds: ['4c29f8b013adea4d5cca1861fb2161d5089613ea'],
        notChannels,
      },
    });

    rData.push({
      title: 'Trending Channels',
      link: `/$/${PAGES.DISCOVER}?claim_type=channel`,
      options: {
        pageSize: 8,
        claimType: 'channel',
        orderBy: ['trending_group', 'trending_mixed'],
        notChannels,
      },
    });

    if (followedTags.length > 0 && followedTags.length < 5) {
      const followedRows = followedTags.map((tag: Tag) => ({
        title: `Trending Channels for #${toCapitalCase(tag.name)}`,
        link: `/$/${PAGES.DISCOVER}?t=${tag.name}&claim_type=channel`,
        options: {
          claimType: 'channel',
          pageSize: 4,
          tags: [tag.name],
          notChannels,
        },
      }));
      rData.push(...followedRows);
    }

    if (followedTags.length > 4) {
      rData.push({
        title: 'Trending For Your Tags',
        link: `/$/${PAGES.TAGS_FOLLOWING}?claim_type=channel`,
        options: {
          claimType: 'channel',
          tags: followedTags.map(tag => tag.name),
          notChannels,
        },
      });
    }
    return rData;
  };
  const [rowData] = React.useState(getRowData() || []);

  return (
    <Page>
      {rowData.map(({ title, link, help, options = {} }) => (
        <div key={title} className="claim-grid__wrapper">
          <h1 className="section__actions">
            {link ? (
              <Button
                className="claim-grid__title"
                button="link"
                navigate={link}
                iconRight={ICONS.ARROW_RIGHT}
                label={__(title)}
              />
            ) : (
              <span className="claim-grid__title">{__(title)}</span>
            )}
            {help}
          </h1>
          { /* This does infinite claim_search if apis are down */ }
          <ClaimTilesDiscover {...options} />
        </div>
      ))}
      <h1 id={MORE_CHANNELS_ANCHOR} className="claim-grid__title">
        {__('More Channels')}
      </h1>
      {/* odysee: claimIds = PRIMARY_CONTENT_CHANNEL_IDS if simplesite CLD */}

      <ClaimListDiscover
        defaultOrderBy={CS.ORDER_BY_TRENDING}
        defaultFreshness={CS.FRESH_ALL}
        claimType={CS.CLAIM_CHANNEL}
        claimIds={SIMPLE_SITE ? PRIMARY_CONTENT_CHANNEL_IDS : undefined}
        scrollAnchor={MORE_CHANNELS_ANCHOR}
      />

    </Page>
  );
}

export default ChannelsFollowingDiscover;
