// @flow

/*
Creating custom homepage items
1) in web/ folder, copy `.env.defaults` to `.env` and make CUSTOM_HOMEPAGE=true
2) copy this file to homepage.js
3) Create item objects
  {
  title, // how the title link displays
  link, // where the title link goes
  options // what search results populate the homepage item
  }
4) rowData.push(item) for each item in the order you want them

Item object examples:
  Specific Channel

  const LATEST_FROM_%CHANNEL% = {
    title: 'Latest From @%channel%',
    link: `/@%channelName%:%canonicalId%`,
    options: {
      orderBy: ['release_time'],
      pageSize: 4,
      channelIds: ['%channelId%'],
    },
  };

  More complex List of channels with description icon filtering by fee_amount etc are possible

  SOME_CHANNEL_IDS = ['channelId1', 'channelId2']
  SOME_TAG = '
  const SOME_CHANNELS_ITEM = {
      title: '#aTitle',
      link: `/$/${PAGES.DISCOVER}?${CS.TAGS_KEY}=aTag&fee_amount=>0&${CS.CLAIM_TYPE}=${CS.CLAIM_STREAM}&${
        CS.CHANNEL_IDS_KEY
        }=${SOME_CHANNEL_IDS.join(',')}`,
      help: (
        <div className="claim-grid__help">
          <Icon
            icon={ICONS.HELP}
            tooltip
            customTooltipText={__(
              'Some tooltip text.'
            )}
          />
        </div>
      ),
      options: { // search options
        feeAmount: '>0',
        claimType: ['stream'],
        tags: ['tagOne', 'tagTwo'],
        pageSize: 8,
        channelIds: SOME_CHANNEL_IDS,
      },
  };
 */
// import * as PAGES from 'constants/pages';
// import * as CS from 'constants/claim_search';
// import * as ICONS from 'constants/icons';
// import { parseURI } from 'lbry-redux';
// import moment from 'moment';
// import { toCapitalCase } from 'util/string';
// import React from 'react';
// import Icon from 'component/common/icon';

// type RowDataItem = {
//   title: string,
//   link?: string,
//   help?: any,
//   options?: {},
// };

// export default function getHomePageRowData(
//   authenticated: boolean,
//   showPersonalizedChannels: boolean,
//   showPersonalizedTags: boolean,
//   subscribedChannels: Array<Subscription>,
//   followedTags: Array<Tag>,
//   showIndividualTags: boolean
// ) {
//   let rowData: Array<RowDataItem> = [];
//   const individualTagDataItems: Array<RowDataItem> = [];
//   const PAID_BETA_CHANNEL_IDS_KEY = [
//     '4ee7cfaf1fc50a6df858ed0b99c278d633bccca9',
//     '5af39f818f668d8c00943c9326c5201c4fe3c423',
//     'cda9c4e92f19d6fe0764524a2012056e06ca2055',
//     '760da3ba3dd85830a843beaaed543a89b7a367e7',
//     '40c36948f0da072dcba3e4833e90f71e16de78be',
//     'e8f68563d242f6ac9784dcbc41dd86c28a9391d6',
//     '7236fc5d2783ea7314d9076ae6c8a250e3992d1a',
//     '8627af93c1a1219150f06b698f4b33e6ed2f1c1e',
//     'c5b0b17838df2f6c31162f64d55f60f34ae8bfc6',
//     'f576d5dba905fc179de880c3fe3eb3281ea74f59',
//     '97dd77c93c9603cbb2583f3589f7f5a6c92baa43',
//     'f399d873e0c37cf24de9569b5f22bbb30a5c6709',
//     'dba870d0620d41b2b9a152c961e0c06cf875ccfc',
//     'ca1fd651c9d14bf2e5088bb2aa0146ee7aeb2ae0',
//     '50ad846a4b1543b847bf3fdafb7b45f6b2f5844c',
//     'e09ff5abe9fb44dd0dd0576894a6db60a6211603',
//     '7b6f7517f6b816827d076fa0eaad550aa315a4e7',
//     '2068452c41d8da3bd68961335da0072a99258a1a',
//     '3645cf2f5d0bdac0523f945be1c3ff60758f7845',
//     '4da85b12244839d6368b9290f1619ff9514ab2a8',
//     '4ad942982e43326c7700b1b6443049b3cfd82161',
//     '55304f219244abf82f684f759cc0c7769242f3b4',
//     '8f42e5b592bb7f7a03f4a94a86a41b1236bb099f',
//     'e2a014d885a48f5be2dc6409610996337312facb',
//     'c18996ca488753f714d36d4654715927c1d7f9c2',
//     'ebc4214424cfa683a7046e1f794fea1e44788d84',
//     '06b6d6d6a893fb589ec2ded948f5122856921ed5',
//     '07e4546674268fc0222b2ca22d31d0549dc217ee',
//     '060940e41973d4f7f16d72a2733138e931c35f41',
//     'f8d6eccd887c9cebd36b1d42aa349279b7f5c3ed',
//     '68098b8426f967b8d04cc566348b5c128823219e',
//     '2bfe6cdb24a21bdc1b76fb7c416edd50e9e85945',
//     '1f9bb08bfa2259629f4aaa9ed40f97e9a41b6fa1',
//     '2f20148495612946675fe1c8ea99171e4d950b81',
//     'bc6938fa1e09e840056c2e831abf9664f397c472',
//     '2a6194792beac5130641e932b5ac6e5a99b5ca4f',
//     '185ba2bd547a5e4a77d29fe6c1484f47db5e058f',
//     '29cc7f6081268eaa5b3f2946e0cd0b952a94812c',
//     'ffdc62ac2f7549398d3aca9d2119e83d80d588d5',
//     'd7a4d2808074b0c55d6b239f69d90e7a4930f943',
//     'd58aa4a0b2f6c2504c3abce8de3f1afb71800acc',
//     '77ae23dc7eb8a75609881d4548a79e4935a89d37',
//     'f79bce8a60fbece671f6265adc39f6469f3b9b8c',
//     '051995fdf0af634e4911704057a551e9392e62b1',
//     'b0e489f986c345aef23c4a48d91cbcf5a6fdb9ac',
//     '825aa21c8c0bda4ded3e69a69238763c8cfcc13b',
//     '49389450b1241f5d8f4c8c4271a3eb56bba33965',
//     'f3b9973e1725ecb50da3e6fa4d47343c98ef0382',
//     '321b33d22c8e24ef207e3f357a4573f6a56611f3',
//     '20d694ada07e740c6fa43a8c324cb7d6e362b5ee',
//     'cf7792c2a37d0d76aaaff84aff0b99a8c791429d',
//     '8316ac90764fedf3147799b7b81a6575a9cc398e',
//     '8972a1bd06de5186e5e89292b05aac8aaa817791',
//     '5da63df97c8255ae94a88940695b8471657dd5a1',
//     'f3da2196b5151570d980b34d311ee0973225a68e',
//     '7644fdb8342624f6c647c79de25610801573fa68',
//   ];

//   const TV_PAID_BETA_ROW = {
//     title: '#lbrytvpaidbeta',
//     link: `/$/${PAGES.DISCOVER}?${CS.TAGS_KEY}=lbrytvpaidbeta&fee_amount=>0&${CS.CLAIM_TYPE}=${CS.CLAIM_STREAM}&${
//       CS.CHANNEL_IDS_KEY
//     }=${PAID_BETA_CHANNEL_IDS_KEY.join(',')}`,
//     help: (
//       <div className="claim-grid__help">
//         <Icon
//           icon={ICONS.HELP}
//           tooltip
//           customTooltipText={__(
//             'Check your rewards page to see if you qualify for paid content reimbursement. Only content in this section qualifies.'
//           )}
//         />
//       </div>
//     ),
//     options: {
//       feeAmount: '>0',
//       claimType: ['stream'],
//       tags: ['lbrytvpaidbeta', 'lbry tvpaidbeta'],
//       pageSize: 8,
//       channelIds: PAID_BETA_CHANNEL_IDS_KEY,
//     },
//   };

//   if (followedTags.length) {
//     followedTags.forEach((tag: Tag) => {
//       individualTagDataItems.push({
//         title: `Trending for #${toCapitalCase(tag.name)}`,
//         link: `/$/${PAGES.DISCOVER}?t=${tag.name}`,
//         options: {
//           pageSize: 4,
//           tags: [tag.name],
//           claimType: ['stream'],
//         },
//       });
//     });
//   }

//   const RECENT_FROM_FOLLOWING = {
//     title: 'Recent From Following',
//     link: `/$/${PAGES.CHANNELS_FOLLOWING}`,
//     options: {
//       orderBy: ['release_time'],
//       releaseTime:
//         subscribedChannels.length > 20
//           ? `>${Math.floor(
//               moment()
//                 .subtract(6, 'months')
//                 .startOf('week')
//                 .unix()
//             )}`
//           : `>${Math.floor(
//               moment()
//                 .subtract(1, 'year')
//                 .startOf('week')
//                 .unix()
//             )}`,
//       pageSize: subscribedChannels.length > 3 ? 8 : 4,
//       channelIds: subscribedChannels.map((subscription: Subscription) => {
//         const { channelClaimId } = parseURI(subscription.uri);
//         return channelClaimId;
//       }),
//     },
//   };

//   const TOP_CONTENT_TODAY = {
//     title: 'Top Content from Today',
//     link: `/$/${PAGES.DISCOVER}?${CS.ORDER_BY_KEY}=${CS.ORDER_BY_TOP}&${CS.FRESH_KEY}=${CS.FRESH_DAY}`,
//     options: {
//       pageSize: showPersonalizedChannels || showPersonalizedTags ? 4 : 8,
//       orderBy: ['effective_amount'],
//       claimType: ['stream'],
//       releaseTime: `>${Math.floor(
//         moment()
//           .subtract(1, 'day')
//           .startOf('day')
//           .unix()
//       )}`,
//     },
//   };

//   const TOP_CHANNELS = {
//     title: 'Top Channels On LBRY',
//     link: `/$/${PAGES.DISCOVER}?claim_type=channel&${CS.ORDER_BY_KEY}=${CS.ORDER_BY_TOP}&${CS.FRESH_KEY}=${CS.FRESH_ALL}`,
//     options: {
//       orderBy: ['effective_amount'],
//       claimType: ['channel'],
//     },
//   };

//   const TRENDING_CLASSICS = {
//     title: 'Trending Classics',
//     link: `/$/${PAGES.DISCOVER}?${CS.ORDER_BY_KEY}=${CS.ORDER_BY_TRENDING}&${CS.FRESH_KEY}=${CS.FRESH_WEEK}`,
//     options: {
//       pageSize: 4,
//       claimType: ['stream'],
//       releaseTime: `<${Math.floor(
//         moment()
//           .subtract(6, 'month')
//           .startOf('day')
//           .unix()
//       )}`,
//     },
//   };

//   const TRENDING_ON_LBRY = {
//     title: 'Trending On LBRY',
//     link: `/$/${PAGES.DISCOVER}`,
//     options: {
//       pageSize: showPersonalizedChannels || showPersonalizedTags ? 4 : 8,
//     },
//   };

//   const TRENDING_FOR_TAGS = {
//     title: 'Trending For Your Tags',
//     link: `/$/${PAGES.TAGS_FOLLOWING}`,
//     options: {
//       tags: followedTags.map(tag => tag.name),
//       claimType: ['stream'],
//     },
//   };

//   const LATEST_FROM_LBRY = {
//     title: 'Latest From @lbry',
//     link: `/@lbry:3f`,
//     options: {
//       orderBy: ['release_time'],
//       pageSize: 4,
//       channelIds: ['3fda836a92faaceedfe398225fb9b2ee2ed1f01a'],
//     },
//   };

//   const LATEST_FROM_LBRYCAST = {
//     title: 'Latest From @lbrycast',
//     link: `/@lbrycast:4`,
//     options: {
//       orderBy: ['release_time'],
//       pageSize: 4,
//       channelIds: ['4c29f8b013adea4d5cca1861fb2161d5089613ea'],
//     },
//   };

//   if (showPersonalizedChannels) rowData.push(RECENT_FROM_FOLLOWING);
//   if (showPersonalizedTags && !showIndividualTags) rowData.push(TRENDING_FOR_TAGS);
//   if (showPersonalizedTags && showIndividualTags) {
//     individualTagDataItems.forEach((item: RowDataItem) => {
//       rowData.push(item);
//     });
//   }
//   if (authenticated) {
//     rowData.push(TV_PAID_BETA_ROW);
//   }
//   rowData.push(TOP_CONTENT_TODAY);
//   rowData.push(TRENDING_ON_LBRY);
//   if (!showPersonalizedChannels) rowData.push(TOP_CHANNELS);
//   if (!authenticated) {
//     rowData.push(TV_PAID_BETA_ROW);
//   }
//   rowData.push(TRENDING_CLASSICS);
//   rowData.push(LATEST_FROM_LBRYCAST);
//   rowData.push(LATEST_FROM_LBRY);

//   return rowData;
// }
