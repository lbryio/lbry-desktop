// @flow
import * as PAGES from 'constants/pages';
import * as CS from 'constants/claim_search';
import { parseURI } from 'lbry-redux';
import moment from 'moment';
import { toCapitalCase } from 'util/string';

type RowDataItem = {
  title: string,
  link?: string,
  help?: any,
  options?: {},
};

export default function getHomePageRowData(
  showPersonalizedChannels: boolean,
  showPersonalizedTags: boolean,
  subscribedChannels: Array<Subscription>,
  followedTags: Array<Tag>,
  showIndividualTags: boolean
) {
  let rowData: Array<RowDataItem> = [];
  let individualTagDataItems: Array<RowDataItem> = [];

  if (followedTags.length) {
    followedTags.forEach((tag: Tag) => {
      individualTagDataItems.push({
        title: `Trending for #${toCapitalCase(tag.name)}`,
        link: `/$/${PAGES.DISCOVER}?t=${tag.name}`,
        options: {
          pageSize: 4,
          tags: [tag.name],
          claimType: ['stream'],
        },
      });
    });
  }
  /*
  Build sections using title, link, and search options
   */

  const RECENT_FROM_FOLLOWING = {
    title: 'Recent From Following',
    link: `/$/${PAGES.CHANNELS_FOLLOWING}`,
    options: {
      orderBy: ['release_time'],
      releaseTime: subscribedChannels.length > 20
        ? `>${Math.floor(
          moment()
            .subtract(6, 'months')
            .startOf('week')
            .unix()
        )}`
        : `>${Math.floor(
          moment()
            .subtract(1, 'year')
            .startOf('week')
            .unix()
        )}`,
      pageSize: subscribedChannels.length > 3 ? 8 : 4,
      channelIds: subscribedChannels.map((subscription: Subscription) => {
        const { channelClaimId } = parseURI(subscription.uri);
        return channelClaimId;
      }),
    },
  };

  const TOP_CONTENT_TODAY = {
    title: 'Top Content from Today',
    link: `/$/${PAGES.DISCOVER}?${CS.ORDER_BY_KEY}=${CS.ORDER_BY_TOP}&${CS.FRESH_KEY}=${CS.FRESH_DAY}`,
    options: {
      pageSize: showPersonalizedChannels || showPersonalizedTags ? 4 : 8,
      orderBy: ['effective_amount'],
      claimType: ['stream'],
      releaseTime: `>${Math.floor(
        moment()
          .subtract(1, 'day')
          .startOf('day')
          .unix()
      )}`,
    },
  }

  const TOP_CHANNELS = {
    title: 'Top Channels On LBRY',
    link: `/$/${PAGES.DISCOVER}?claim_type=channel&${CS.ORDER_BY_KEY}=${CS.ORDER_BY_TOP}&${CS.FRESH_KEY}=${CS.FRESH_ALL}`,
    options: {
      orderBy: ['effective_amount'],
      claimType: ['channel'],
    },
  };

  const TRENDING_CLASSICS = {
    title: 'Trending Classics',
    link: `/$/${PAGES.DISCOVER}?${CS.ORDER_BY_KEY}=${CS.ORDER_BY_TRENDING}&${CS.FRESH_KEY}=${CS.FRESH_WEEK}`,
    options: {
      pageSize: 4,
      claimType: ['stream'],
      releaseTime: `<${Math.floor(
        moment()
          .subtract(6, 'month')
          .startOf('day')
          .unix()
      )}`,
    },
  };

  const TRENDING_ON_LBRY = {
    title: 'Trending On LBRY',
    link: `/$/${PAGES.DISCOVER}`,
    options: {
      pageSize: showPersonalizedChannels || showPersonalizedTags ? 4 : 8,
    },
  };

  const TRENDING_FOR_TAGS = {
    title: 'Trending For Your Tags',
    link: `/$/${PAGES.TAGS_FOLLOWING}`,
    options: {
      tags: followedTags.map(tag => tag.name),
      claimType: ['stream'],
    },
  };

  // Replace the following with valid info
  // const LATEST_FROM_%CHANNEL% = {
  //   title: 'Latest From @%channel%',
  //   link: `/@%channelName%:%canonicalId%`,
  //   options: {
  //     orderBy: ['release_time'],
  //     pageSize: 4,
  //     channelIds: ['%channelId%'],
  //   },
  // };

  const LATEST_FROM_LBRY = {
    title: 'Latest From @lbry',
    link: `/@lbry:3f`,
    options: {
      orderBy: ['release_time'],
      pageSize: 4,
      channelIds: ['3fda836a92faaceedfe398225fb9b2ee2ed1f01a'],
    },
  };

  const LATEST_FROM_LBRYCAST = {
    title: 'Latest From @lbrycast',
    link: `/@lbrycast:4`,
    options: {
      orderBy: ['release_time'],
      pageSize: 4,
      channelIds: ['3fda836a92faaceedfe398225fb9b2ee2ed1f01a'],
    },
  };

  // if (showPersonalizedChannels) rowData.push(RECENT_FROM_FOLLOWING);
  // if (showPersonalizedTags && !showIndividualTags) rowData.push(TRENDING_FOR_TAGS);
  // if (showPersonalizedTags && showIndividualTags) {
  //   individualTagDataItems.forEach((item: RowDataItem) => {
  //     rowData.push(item);
  //   });
  // }
  // rowData.push(TOP_CONTENT_TODAY);
  rowData.push(LATEST_FROM_LBRYCAST);
  rowData.push(TRENDING_ON_LBRY);
  rowData.push(TRENDING_CLASSICS);
  // if (!showPersonalizedChannels) rowData.push(TOP_CHANNELS);
  // rowData.push(LATEST_FROM_LBRY);
  // rowData.push(LATEST_FROM_LBRYCAST);

  return rowData;
}
