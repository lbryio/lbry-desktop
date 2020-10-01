// @flow
// import * as ICONS from 'constants/icons';
// import * as PAGES from 'constants/pages';
import * as CS from 'constants/claim_search';
import React from 'react';
import Page from 'component/page';
// import Button from 'component/button';
import ClaimListDiscover from 'component/claimListDiscover';
// import { toCapitalCase } from 'util/string';
import { PRIMARY_CONTENT_CHANNEL_IDS } from 'homepage';

type Props = {
  followedTags: Array<Tag>,
  subscribedChannels: Array<Subscription>,
  blockedChannels: Array<string>,
};

function ChannelsFollowingDiscover(props: Props) {
  //   const { followedTags, subscribedChannels, blockedChannels } = props;
  //   let rowData: Array<RowDataItem> = [];
  //   const notChannels = subscribedChannels
  //     .map(({ uri }) => uri)
  //     .concat(blockedChannels)
  //     .map(uri => uri.split('#')[1]);

  //   rowData.push({
  //     title: 'Top Channels Of All Time',
  //     link: `/$/${PAGES.DISCOVER}?claim_type=channel&${CS.ORDER_BY_KEY}=${CS.ORDER_BY_TOP}&${CS.FRESH_KEY}=${CS.FRESH_ALL}`,
  //     options: {
  //       pageSize: 12,
  //       claimType: 'channel',
  //       orderBy: ['effective_amount'],
  //     },
  //   });

  //   rowData.push({
  //     title: 'Latest From @lbrycast',
  //     link: `/@lbrycast:4`,
  //     options: {
  //       orderBy: ['release_time'],
  //       pageSize: 8,
  //       channelIds: ['4c29f8b013adea4d5cca1861fb2161d5089613ea'],
  //     },
  //   });

  //   rowData.push({
  //     title: 'Trending Channels',
  //     link: `/$/${PAGES.DISCOVER}?claim_type=channel`,
  //     options: {
  //       pageSize: 8,
  //       claimType: 'channel',
  //       orderBy: ['trending_group', 'trending_mixed'],
  //     },
  //   });

  //   if (followedTags.length > 0 && followedTags.length < 5) {
  //     const followedRows = followedTags.map((tag: Tag) => ({
  //       title: `Trending Channels for #${toCapitalCase(tag.name)}`,
  //       link: `/$/${PAGES.DISCOVER}?t=${tag.name}&claim_type=channel`,
  //       options: {
  //         claimType: 'channel',
  //         pageSize: 4,
  //         tags: [tag.name],
  //       },
  //     }));
  //     rowData.push(...followedRows);
  //   }

  //   if (followedTags.length > 4) {
  //     rowData.push({
  //       title: 'Trending For Your Tags',
  //       link: `/$/${PAGES.TAGS_FOLLOWING}?claim_type=channel`,
  //       options: {
  //         claimType: 'channel',
  //         tags: followedTags.map(tag => tag.name),
  //       },
  //     });
  //   }

  //   const rowDataWithGenericOptions = rowData.map(row => {
  //     return {
  //       ...row,
  //       options: {
  //         ...row.options,
  //         notChannels,
  //       },
  //     };
  //   });

  return (
    <Page>
      <ClaimListDiscover
        hideFilters
        header={<h1 className="section__title">{__('Moon cheese is an acquired taste')}</h1>}
        defaultOrderBy={CS.ORDER_BY_TRENDING}
        defaultFreshness={CS.FRESH_ALL}
        claimType={CS.CLAIM_CHANNEL}
        claimIds={PRIMARY_CONTENT_CHANNEL_IDS}
        maxPages={3}
      />

      {/* {rowDataWithGenericOptions.map(({ title, link, help, options = {} }) => (
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
      ))} */}
      {/* <h1 className="claim-grid__title">{__('More Channels')}</h1> */}
      {/* <ClaimListDiscover defaultOrderBy={CS.ORDER_BY_TOP} defaultFreshness={CS.FRESH_ALL} claimType="channel" /> */}
    </Page>
  );
}

export default ChannelsFollowingDiscover;
