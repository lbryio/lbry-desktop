// @flow
import * as PAGES from 'constants/pages';
import * as ICONS from 'constants/icons';
import * as CS from 'constants/claim_search';
import { parseURI } from 'util/lbryURI';
import moment from 'moment';
import { toCapitalCase } from 'util/string';
import { CUSTOM_HOMEPAGE } from 'config';

export type HomepageCat = {
  name: string,
  icon: string,
  label: string,
  channelIds?: Array<string>,
  daysOfContent?: number,
  channelLimit?: string,
  pageSize?: number,
  claimType?: string,
  order?: string,
  tags?: Array<string>,
  pinnedUrls?: Array<string>,
  pinnedClaimIds?: Array<string>, // takes precedence over pinnedUrls
  excludedChannelIds?: Array<string>,
  searchLanguages?: Array<string>,
  mixIn?: Array<string>,
  hideByDefault?: boolean,
};

function getLimitPerChannel(size, isChannel) {
  if (isChannel) {
    return 1;
  } else {
    return size < 250 ? (size < 150 ? 3 : 2) : 1;
  }
}

export function getAllIds(all: any) {
  const idsSet: Set<string> = new Set();
  (Object.values(all): any).forEach((cat) => {
    if (cat.channelIds) {
      cat.channelIds.forEach((id) => idsSet.add(id));
    }
  });
  // $FlowFixMe
  return Array.from(idsSet);
}

export const getHomepageRowForCat = (key: string, cat: HomepageCat) => {
  let orderValue;
  switch (cat.order) {
    case 'trending':
      orderValue = CS.ORDER_BY_TRENDING_VALUE;
      break;
    case 'top':
      orderValue = CS.ORDER_BY_TOP_VALUE;
      break;
    case 'new':
      orderValue = CS.ORDER_BY_NEW_VALUE;
      break;
    default:
      orderValue = CS.ORDER_BY_TRENDING_VALUE;
  }

  let urlParams = new URLSearchParams();
  if (cat.claimType) {
    urlParams.set(CS.CLAIM_TYPE, cat.claimType);
  }
  if (cat.channelIds) {
    urlParams.set(CS.CHANNEL_IDS_KEY, cat.channelIds.join(','));
  }

  const isChannelType = cat.claimType && cat.claimType === 'channel';

  // can intend no limit, numerica auto limit, specific limit.
  let limitClaims;
  if (typeof cat.channelLimit === 'string' && cat.channelIds && cat.channelIds.length) {
    if (cat.channelLimit === 'auto') {
      limitClaims = getLimitPerChannel(cat.channelIds.length, isChannelType);
    } else if (cat.channelLimit) {
      const limitNumber = Number(cat.channelLimit);
      // eslint-disable-next-line
      if (limitNumber === limitNumber && limitNumber !== 0) {
        // because javascript and NaN !== NaN
        limitClaims = Math.floor(limitNumber);
      }
    }
  }

  return {
    id: key,
    link: `/$/${PAGES.DISCOVER}?${urlParams.toString()}`,
    route: cat.name ? `/$/${cat.name}` : undefined,
    icon: cat.icon || '', // some default
    title: cat.label,
    pinnedUrls: cat.pinnedUrls,
    pinnedClaimIds: cat.pinnedClaimIds,
    hideByDefault: cat.hideByDefault,
    options: {
      claimType: cat.claimType || ['stream', 'repost'],
      channelIds: cat.channelIds,
      excludedChannelIds: cat.excludedChannelIds,
      orderBy: orderValue,
      pageSize: cat.pageSize || undefined,
      limitClaimsPerChannel: limitClaims,
      searchLanguages: cat.searchLanguages,
      releaseTime: `>${Math.floor(
        moment()
          .subtract(cat.daysOfContent || 30, 'days')
          .startOf('hour')
          .unix()
      )}`,
    },
  };
};

export function GetLinksData(
  all: any, // HomepageData type?
  isLargeScreen: boolean,
  isHomepage?: boolean,
  authenticated?: boolean,
  showPersonalizedChannels?: boolean,
  showPersonalizedTags?: boolean,
  subscribedChannels?: Array<Subscription>,
  followedTags?: Array<Tag>,
  showIndividualTags?: boolean,
  showNsfw?: boolean
) {
  function getPageSize(originalSize) {
    return isLargeScreen ? originalSize * (3 / 2) : originalSize;
  }

  // $FlowFixMe
  let rowData: Array<RowDataItem> = [];
  const individualTagDataItems: Array<RowDataItem> = [];

  if (isHomepage && showPersonalizedChannels && subscribedChannels) {
    const RECENT_FROM_FOLLOWING = {
      id: 'FOLLOWING',
      title: __('Recent From Following'),
      link: `/$/${PAGES.CHANNELS_FOLLOWING}`,
      icon: ICONS.SUBSCRIBE,
      options: {
        orderBy: CS.ORDER_BY_NEW_VALUE,
        releaseTime:
          subscribedChannels.length > 20
            ? `>${Math.floor(moment().subtract(9, 'months').startOf('week').unix())}`
            : `>${Math.floor(moment().subtract(1, 'year').startOf('week').unix())}`,
        pageSize: getPageSize(subscribedChannels.length > 3 ? (subscribedChannels.length > 6 ? 12 : 8) : 4),
        streamTypes: null,
        channelIds: subscribedChannels.map((subscription: Subscription) => {
          const { channelClaimId } = parseURI(subscription.uri);
          if (channelClaimId) return channelClaimId;
        }),
      },
    };
    // $FlowFixMe flow thinks this might not be Array<string>
    rowData.push(RECENT_FROM_FOLLOWING);
  }

  // **************************************************************************
  // @if CUSTOM_HOMEPAGE='false'

  const YOUTUBER_CHANNEL_IDS = [
    'fb364ef587872515f545a5b4b3182b58073f230f',
    '589276465a23c589801d874f484cc39f307d7ec7',
    'ba79c80788a9e1751e49ad401f5692d86f73a2db',
    'b6e207c5f8c58e7c8362cd05a1501bf2f5b694f2',
    'c5724e280283cd985186af9a62494aae377daabd',
    '243b6f18093ff97c861d0568c7d3379606201a4b',
    '5b7c7a202201033d99e1be2930d290c127c0f4fe',
    'c9da929d12afe6066acc89eb044b552f0d63782a',
    '89985db232ec2a9a31dbd985196de817da223fe6',
    '187bf3616318b4bfb85223fc40724c307696f0c6',
    'aa3db8d2145340e26597b88fbb6d0e7ff09786be',
    'a9d289718f3f14e3d1fa8da7a7fcfdb6f40ae2d7',
    '9a5dfcb1a4b29c3a1598392d039744b9938b5a26',
    '0b998b98a2b9a88d9519739f99f2c74c95e3fc22',
    '46be492ee0f56db11e005991c537c867a8682f77',
    'c5cd9b63e2ba0abc191feae48238f464baecb147',
    '4b602d7a3e268abb45951f623a109d2a131ab0ba',
    'd25ae97a1516f5700fc717152b885f33da47f12b',
    '8f4fecfc836ea33798ee3e5cef56926fa54e2cf9',
    '8671dfd2f34302c1a4dcb4dd7361568a0bb23eba',
    'b9288432bd089c6f332145aab08a56eec155f307',
    '87b13b074936b1f42a7c6758c7c2995f58c602e7',
    '25f384bd95e218f6ac37fcaca99ed40f36760d8c',
    '02c020b2fab7dd1fbd175c3b22947688c0a219e5',
    '57dbc8fdc4d062e2824d8550861b380203539099',
    '4e17d248adc0128afe969c2e1327e10afd9cb921',
    '760da3ba3dd85830a843beaaed543a89b7a367e7',
    '5a1b164d0a2e7adf1db08d7363ea1cb06c30cd74',
    'c9da929d12afe6066acc89eb044b552f0d63782a',
    '113515e893b8186595595e594ecc410bae50c026',
    '5fbfcf517d3df749bd032a44c1946b2baa738ecb',
    '74333143a3dcc001a5602aa524583fc75a013d75',
    '0d4e104ffc0ff0a6c8701e67cf13760f4e0335a8',
    'b924ac36b7499591f7929d9c4903de79b07b1cb9',
    '13edd7e7e2fbaf845699cf2f8f0b1c095bacb05f',
    '7b1c72ba903af4aecdc2595397a9cb91bb7f188d',
    '6c0bf1fed2705d675da950a94e4af004ec975a06',
    'f33657a2fcbab2dc3ce555d5d6728f8758af7bc7',
    '26c9b54d7e47dc8f7dc847821b26fce3009ee1a0',
    '1516361918bfd02ddd460489f438e153c918521c',
    'd468989b4668bce7452fc3434a6dc7ba7d799378',
    'a1c8f84670da9a3371bc5832e86c8d32826b2f2e',
    '70e56234217f30317c0e67fd0eede6e82b74aea0',
    '7a88e0eabf60af5ac61240fe60f8f08fa3e48ab4',
    '2f229d3ac26aa655c5123c29f1f7352403279ca3',
    '7ea92a937f5755b40ac3d99ed37c53b40359b0a2',
    '96ede5667bc4533ace8cfcbde4f33aa9fe1ae5f5',
    '5097b175c4c58c431424ce3b60901de6ae650127',
    '32de523ba228dd3f3159eb5a6cc07b6fd51f4dc0',
    'cdb6fe516afe08618b91a754f92412e7f98a8a62',
    '1e9f582c2df798228e8583fe1101fee551487d4b',
    'b032695b52a78e0f5251b8d7f2f32183a5985d19',
    'c042155dfcb5c813345248bff18a62d0f585718e',
    '294f5c164da5ac9735658b2d58d8fee6745dfc45',
    '07e4546674268fc0222b2ca22d31d0549dc217ee',
    '1487afc813124abbeb0629d2172be0f01ccec3bf',
    'ac471128a5ed05b80365170b29997d860afa33b7',
    'c101bac49ec048acca169fd6090e70f7488645b1',
    'c9282bbb89d3f9f5f1d972a02f96a5f0f0f40df8',
    '9576be30de21b3b755828314d6ccbbaa3334f43a',
    'b12e255e9f84d8b4ed86343b27676dccbc8b6d8b',
    '50ebba2b06908f93d7963b1c6826cc0fd6104477',
    '84342ae85d216d5ffc0ef149a123aae649d5c253',
    '80f78c4b8591390758b9e6303eaf9087180444ad',
    '086d2bacf441cef45ff15b5afe163d0b03a9f7ea',
    '5af39f818f668d8c00943c9326c5201c4fe3c423',
    '057053dfb657aaa98553e2c544b06e1a2371557e',
    'fd1aee1d4858ec2ef6ccc3e60504c76e9d774386',
    '930fc43ca7bae20d4706543e97175d1872b0671f',
    'e715c457b4a3e51214b62f49f05303bba4ee5be9',
    'ebf5bc6842638cefcf66904522ac96231ea7a9d8',
    '1f9bb08bfa2259629f4aaa9ed40f97e9a41b6fa1',
    'ac415179241e0cd8a14ed71175b759254d381137',
    '8e098d2042ad9b9074f52cc06b89d6d4db5231dd',
    '149c4686ff0792b8d68dac1f17b6273a85628d34',
    '199eba05b6ecccab919e26a0cb7dacd544f25700',
    '6569758308f12a66001e28f5e6056cb84334e69c',
    'e50f82e2236274c54af762a9c2b897646477ef62',
    '7e1a7afadc8734b33a3e219f5668470715fb063d',
    'ff80e24f41a2d706c70df9779542cba4715216c9',
    'e8f68563d242f6ac9784dcbc41dd86c28a9391d6',
  ];

  const YOUTUBE_CREATOR_ROW = {
    title: __('CableTube Escape Artists'),
    link: `/$/${PAGES.DISCOVER}?${CS.CLAIM_TYPE}=${CS.CLAIM_STREAM}&${CS.CHANNEL_IDS_KEY}=${YOUTUBER_CHANNEL_IDS.join(
      ','
    )}`,
    options: {
      claimType: ['stream'],
      orderBy: ['release_time'],
      pageSize: getPageSize(12),
      channelIds: YOUTUBER_CHANNEL_IDS,
      limitClaimsPerChannel: 1,
      releaseTime: `>${Math.floor(moment().subtract(1, 'months').startOf('week').unix())}`,
    },
  };

  const TOP_CONTENT_TODAY = {
    title: __('Top Content from Today'),
    link: `/$/${PAGES.DISCOVER}?${CS.ORDER_BY_KEY}=${CS.ORDER_BY_TOP}&${CS.FRESH_KEY}=${CS.FRESH_DAY}`,
    options: {
      pageSize: getPageSize(showPersonalizedChannels || showPersonalizedTags ? 4 : 8),
      orderBy: ['effective_amount'],
      claimType: ['stream'],
      limitClaimsPerChannel: 2,
      releaseTime: `>${Math.floor(moment().subtract(1, 'day').startOf('day').unix())}`,
    },
  };

  const TOP_CHANNELS = {
    title: __('Top Channels On LBRY'),
    link: `/$/${PAGES.DISCOVER}?claim_type=channel&${CS.ORDER_BY_KEY}=${CS.ORDER_BY_TOP}&${CS.FRESH_KEY}=${CS.FRESH_ALL}`,
    options: {
      orderBy: ['effective_amount'],
      claimType: ['channel'],
    },
  };

  const LATEST_FROM_LBRY = {
    title: __('Latest From @lbry'),
    link: `/@lbry:3f`,
    options: {
      orderBy: ['release_time'],
      pageSize: getPageSize(4),
      channelIds: ['3fda836a92faaceedfe398225fb9b2ee2ed1f01a'],
    },
  };

  if (isHomepage && !CUSTOM_HOMEPAGE) {
    if (followedTags) {
      const TRENDING_FOR_TAGS = {
        title: __('Trending For Your Tags'),
        link: `/$/${PAGES.TAGS_FOLLOWING}`,
        icon: ICONS.TAG,

        options: {
          pageSize: getPageSize(4),
          tags: followedTags.map((tag) => tag.name),
          claimType: ['stream'],
          limitClaimsPerChannel: 2,
        },
      };
      followedTags.forEach((tag: Tag) => {
        const tagName = `#${toCapitalCase(tag.name)}`;
        individualTagDataItems.push({
          id: tagName,
          title: __('Trending for %tagName%', { tagName: tagName }),
          link: `/$/${PAGES.DISCOVER}?t=${tag.name}`,
          options: {
            pageSize: 4,
            tags: [tag.name],
            claimType: ['stream'],
          },
        });
      });
      if (showPersonalizedTags && !showIndividualTags) rowData.push(TRENDING_FOR_TAGS);
      if (showPersonalizedTags && showIndividualTags) {
        individualTagDataItems.forEach((item: RowDataItem) => {
          rowData.push(item);
        });
      }
    }
  }

  if (!CUSTOM_HOMEPAGE) {
    if (!authenticated) {
      rowData.push(YOUTUBE_CREATOR_ROW);
    }
    rowData.push(TOP_CONTENT_TODAY);
    rowData.push(LATEST_FROM_LBRY);
    if (!showPersonalizedChannels) rowData.push(TOP_CHANNELS);
  }

  // @endif
  // **************************************************************************

  const entries = Object.entries(all);
  for (let i = 0; i < entries.length; ++i) {
    const key = entries[i][0];
    const val = entries[i][1];

    // $FlowIgnore (https://github.com/facebook/flow/issues/2221)
    rowData.push(getHomepageRowForCat(key, val));
  }

  return rowData;
}
