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
import { CUSTOM_HOMEPAGE, SIMPLE_SITE } from 'config';

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
  const { PRIMARY_CONTENT, LATEST } = homepageData;
  let channelIds;
  if (CUSTOM_HOMEPAGE) {
    if (LATEST) {
      channelIds = LATEST.channelIds;
    } else if (PRIMARY_CONTENT) {
      channelIds = PRIMARY_CONTENT.channelIds;
    }
  }
  let rowData: Array<ChannelsFollowingItem> = [];
  const notChannels = subscribedChannels
    .map(({ uri }) => uri)
    .concat(blockedChannels)
    .map((uri) => uri.split('#')[1]);

  rowData.push({
    title: 'Top Channels Of All Time',
    link: `/$/${PAGES.DISCOVER}?claim_type=channel&${CS.ORDER_BY_KEY}=${CS.ORDER_BY_TOP}&${CS.FRESH_KEY}=${CS.FRESH_ALL}`,
    options: {
      pageSize: 12,
      claimType: 'channel',
      orderBy: ['effective_amount'],
    },
  });

  rowData.push({
    title: 'Trending Channels',
    link: `/$/${PAGES.DISCOVER}?claim_type=channel`,
    options: {
      pageSize: 8,
      claimType: 'channel',
      orderBy: ['trending_group', 'trending_mixed'],
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
      },
    }));
    rowData.push(...followedRows);
  }

  if (followedTags.length > 4) {
    rowData.push({
      title: 'Trending For Your Tags',
      link: `/$/${PAGES.TAGS_FOLLOWING}?claim_type=channel`,
      options: {
        claimType: 'channel',
        tags: followedTags.map((tag) => tag.name),
      },
    });
  }

  const rowDataWithGenericOptions = rowData.map((row) => {
    return {
      ...row,
      options: {
        ...row.options,
        notChannels,
      },
    };
  });

  return (
    <Page className="discoverPage-wrapper">
      {!SIMPLE_SITE &&
        rowDataWithGenericOptions.map(({ title, link, help, options = {} }) => (
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

            <ClaimTilesDiscover {...options} />
          </div>
        ))}
      {!SIMPLE_SITE && (
        <h1 id={MORE_CHANNELS_ANCHOR} className="claim-grid__title">
          {__('More Channels')}
        </h1>
      )}
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
