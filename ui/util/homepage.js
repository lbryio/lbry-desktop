// @flow
import React from 'react';
import * as PAGES from 'constants/pages';
import * as CS from 'constants/claim_search';
import { parseURI } from 'lbry-redux';
import moment from 'moment';
import { toCapitalCase } from 'util/string';

type RowDataItem = {
  title: any,
  link?: string,
  help?: any,
  options?: {},
};

export default function getHomePageRowData(
  authenticated: boolean,
  showPersonalizedChannels: boolean,
  showPersonalizedTags: boolean,
  subscribedChannels: Array<Subscription>,
  followedTags: Array<Tag>,
  showIndividualTags: boolean
) {
  let rowData: Array<RowDataItem> = [];
  const individualTagDataItems: Array<RowDataItem> = [];
  const YOUTUBER_CHANNEL_IDS = [
    // 'fb364ef587872515f545a5b4b3182b58073f230f',
    // '589276465a23c589801d874f484cc39f307d7ec7',
    // 'ba79c80788a9e1751e49ad401f5692d86f73a2db',
    // 'b6e207c5f8c58e7c8362cd05a1501bf2f5b694f2',
    // 'c5724e280283cd985186af9a62494aae377daabd',
    // '243b6f18093ff97c861d0568c7d3379606201a4b',
    // '5b7c7a202201033d99e1be2930d290c127c0f4fe',
    // 'c9da929d12afe6066acc89eb044b552f0d63782a',
    // '89985db232ec2a9a31dbd985196de817da223fe6',
    // '187bf3616318b4bfb85223fc40724c307696f0c6',
    // 'aa3db8d2145340e26597b88fbb6d0e7ff09786be',
    // 'a9d289718f3f14e3d1fa8da7a7fcfdb6f40ae2d7',
    // '9a5dfcb1a4b29c3a1598392d039744b9938b5a26',
    // '0b998b98a2b9a88d9519739f99f2c74c95e3fc22',
    // '46be492ee0f56db11e005991c537c867a8682f77',
    // 'c5cd9b63e2ba0abc191feae48238f464baecb147',
    // '4b602d7a3e268abb45951f623a109d2a131ab0ba',
    // 'd25ae97a1516f5700fc717152b885f33da47f12b',
    // '8f4fecfc836ea33798ee3e5cef56926fa54e2cf9',
    // '8671dfd2f34302c1a4dcb4dd7361568a0bb23eba',
    // 'b9288432bd089c6f332145aab08a56eec155f307',
    // '87b13b074936b1f42a7c6758c7c2995f58c602e7',
    // '25f384bd95e218f6ac37fcaca99ed40f36760d8c',
    // '02c020b2fab7dd1fbd175c3b22947688c0a219e5',
    // '57dbc8fdc4d062e2824d8550861b380203539099',
    // '4e17d248adc0128afe969c2e1327e10afd9cb921',
    // '760da3ba3dd85830a843beaaed543a89b7a367e7',
    // '5a1b164d0a2e7adf1db08d7363ea1cb06c30cd74',
    // 'c9da929d12afe6066acc89eb044b552f0d63782a',
    // '113515e893b8186595595e594ecc410bae50c026',
    // '5fbfcf517d3df749bd032a44c1946b2baa738ecb',
    // '74333143a3dcc001a5602aa524583fc75a013d75',
    // '0d4e104ffc0ff0a6c8701e67cf13760f4e0335a8',
    // 'b924ac36b7499591f7929d9c4903de79b07b1cb9',
    // '13edd7e7e2fbaf845699cf2f8f0b1c095bacb05f',
    // '7b1c72ba903af4aecdc2595397a9cb91bb7f188d',
    // '6c0bf1fed2705d675da950a94e4af004ec975a06',
    // 'f33657a2fcbab2dc3ce555d5d6728f8758af7bc7',
    // '26c9b54d7e47dc8f7dc847821b26fce3009ee1a0',
    // '1516361918bfd02ddd460489f438e153c918521c',
    // 'd468989b4668bce7452fc3434a6dc7ba7d799378',
    // 'a1c8f84670da9a3371bc5832e86c8d32826b2f2e',
    // '70e56234217f30317c0e67fd0eede6e82b74aea0',
    // '7a88e0eabf60af5ac61240fe60f8f08fa3e48ab4',
    // '2f229d3ac26aa655c5123c29f1f7352403279ca3',
    // '7ea92a937f5755b40ac3d99ed37c53b40359b0a2',
    // '96ede5667bc4533ace8cfcbde4f33aa9fe1ae5f5',
    // '32de523ba228dd3f3159eb5a6cc07b6fd51f4dc0',
    // 'cdb6fe516afe08618b91a754f92412e7f98a8a62',
    // '1e9f582c2df798228e8583fe1101fee551487d4b',
    // 'b032695b52a78e0f5251b8d7f2f32183a5985d19',
    // 'c042155dfcb5c813345248bff18a62d0f585718e',
    // '294f5c164da5ac9735658b2d58d8fee6745dfc45',
    // '07e4546674268fc0222b2ca22d31d0549dc217ee',
    // '1487afc813124abbeb0629d2172be0f01ccec3bf',
    // 'ac471128a5ed05b80365170b29997d860afa33b7',
    // 'c101bac49ec048acca169fd6090e70f7488645b1',
    // 'c9282bbb89d3f9f5f1d972a02f96a5f0f0f40df8',
    // '9576be30de21b3b755828314d6ccbbaa3334f43a',
    // 'b12e255e9f84d8b4ed86343b27676dccbc8b6d8b',
    // '50ebba2b06908f93d7963b1c6826cc0fd6104477',
    // '84342ae85d216d5ffc0ef149a123aae649d5c253',
    // '80f78c4b8591390758b9e6303eaf9087180444ad',
    // '086d2bacf441cef45ff15b5afe163d0b03a9f7ea',
    // '5af39f818f668d8c00943c9326c5201c4fe3c423',
    // '057053dfb657aaa98553e2c544b06e1a2371557e',
    // 'fd1aee1d4858ec2ef6ccc3e60504c76e9d774386',
    // '930fc43ca7bae20d4706543e97175d1872b0671f',
    // 'e715c457b4a3e51214b62f49f05303bba4ee5be9',
    // 'ebf5bc6842638cefcf66904522ac96231ea7a9d8',
    // '1f9bb08bfa2259629f4aaa9ed40f97e9a41b6fa1',
    // 'ac415179241e0cd8a14ed71175b759254d381137',
    // '8e098d2042ad9b9074f52cc06b89d6d4db5231dd',
    // '149c4686ff0792b8d68dac1f17b6273a85628d34',
    // '199eba05b6ecccab919e26a0cb7dacd544f25700',
    // '6569758308f12a66001e28f5e6056cb84334e69c',
    // 'e50f82e2236274c54af762a9c2b897646477ef62',
    // '7e1a7afadc8734b33a3e219f5668470715fb063d',
    // 'ff80e24f41a2d706c70df9779542cba4715216c9',
    // 'e8f68563d242f6ac9784dcbc41dd86c28a9391d6',
    '3fec094c5937e9eb4e8f5e71e4ca430e8a993d03',
    '5097b175c4c58c431424ce3b60901de6ae650127',
    '1d729d8a4bbed9f3e9bec0cf1e958980569b0681',
    '6184648aab0431c4c95c649072d1f9ff08b9bb7c',
    'b5d31cde873073718c033076656a27471e392afc',
    '7317cdf6f62be93b22295062e191f6ba59a5db26',
    '1cdb5d0bdcb484907d0a2fea4efdfe0153838642',
    'b516294f541a18ce00b71a60b2c82ad2f87ff78d',
    '91e42cc450075f2c4c245bac7617bf903f16b4ce',
    'b6e207c5f8c58e7c8362cd05a1501bf2f5b694f2',
    '25f384bd95e218f6ac37fcaca99ed40f36760d8c',
    'f33657a2fcbab2dc3ce555d5d6728f8758af7bc7',
    '5499c784a960d96497151f5e0e8434b84ea5da24',
    '9614a4fcf9d91e4588eb512165e9c0475f857555',
    '294f5c164da5ac9735658b2d58d8fee6745dfc45',
    '119a2e8c0b50f78d3861636d37c3b44ba8e689b5',
    '7b23cca3f49059f005e812be03931c81272eaac4',
    'fb0efeaa3788d1292bb49a94d77622503fe08129',
    '797a528c49b6535560f7fd8222b121b0223287c8',
    'bc490776f367b8afccf0ea7349d657431ba1ded6',
    '48c7ea8bc2c4adba09bf21a29689e3b8c2967522',
    'bf7490f905904e79de5c90e472bb9e6f26e634a0',
    'df961194a798cc76306b9290701130c592530fb6',
    'cf0be9078d76951e2e228df68b5b0bbf71313aaa',
    'd746ac8d782f94d12d176c7a591f5bf8365bef3d',
  ];

  const YOUTUBE_CREATOR_ROW = {
    title: (
      <span className="no-evil">
        <span className="no-evil--blue">D</span>
        <span className="no-evil--red">o</span>
        <span className="no-evil--yellow">n</span>
        <span className="no-evil--blue">'</span>
        <span className="no-evil--green">t</span> <span className="no-evil--red">b</span>
        <span className="no-evil--blue">e</span> <span className="no-evil--red">e</span>
        <span className="no-evil--yellow">v</span>
        <span className="no-evil--blue">i</span>
        <span className="no-evil--green">l</span>
      </span>
    ),
    link: `/$/${PAGES.DISCOVER}?${CS.CLAIM_TYPE}=${CS.CLAIM_STREAM}&${CS.CHANNEL_IDS_KEY}=${YOUTUBER_CHANNEL_IDS.join(
      ','
    )}`,
    options: {
      claimType: ['stream'],
      orderBy: ['release_time'],
      pageSize: 12,
      channelIds: YOUTUBER_CHANNEL_IDS,
      releaseTime: `>${Math.floor(
        moment()
          .subtract(1, 'months')
          .startOf('week')
          .unix()
      )}`,
    },
  };

  if (followedTags.length) {
    followedTags.forEach((tag: Tag) => {
      individualTagDataItems.push({
        title: __(`Trending for `) + `#${toCapitalCase(tag.name)}`,
        link: `/$/${PAGES.DISCOVER}?t=${tag.name}`,
        options: {
          pageSize: 4,
          tags: [tag.name],
          claimType: ['stream'],
        },
      });
    });
  }

  const RECENT_FROM_FOLLOWING = {
    title: __('Recent From Following'),
    link: `/$/${PAGES.CHANNELS_FOLLOWING}`,
    options: {
      orderBy: ['release_time'],
      releaseTime:
        subscribedChannels.length > 20
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
      pageSize: subscribedChannels.length > 3 ? (subscribedChannels.length > 6 ? 16 : 8) : 4,
      channelIds: subscribedChannels.map((subscription: Subscription) => {
        const { channelClaimId } = parseURI(subscription.uri);
        return channelClaimId;
      }),
    },
  };

  const TOP_CONTENT_TODAY = {
    title: __('Latest'),
    link: `/$/${PAGES.DISCOVER}?${CS.ORDER_BY_KEY}=${CS.ORDER_BY_TOP}&${CS.FRESH_KEY}=${CS.FRESH_DAY}`,
    options: {
      pageSize: 12,
      orderBy: ['effective_amount'],
      claimType: ['stream'],
      releaseTime: `>${Math.floor(
        moment()
          .subtract(1, 'day')
          .startOf('day')
          .unix()
      )}`,
    },
  };

  const TRENDING_CLASSICS = {
    title: __('Classics'),
    link: `/$/${PAGES.DISCOVER}?${CS.ORDER_BY_KEY}=${CS.ORDER_BY_TRENDING}&${CS.FRESH_KEY}=${CS.FRESH_WEEK}`,
    options: {
      pageSize: 8,
      claimType: ['stream'],
      releaseTime: `<${Math.floor(
        moment()
          .subtract(6, 'month')
          .startOf('day')
          .unix()
      )}`,
    },
  };

  const TRUMP_CHANNEL_IDS = [];

  const TRUMP = {
    title: __('Donald Trump 🍑 #2020 Election 🇺🇸'),
    link: `/$/${PAGES.DISCOVER}?${CS.CLAIM_TYPE}=${CS.CLAIM_STREAM}&${CS.CHANNEL_IDS_KEY}=${TRUMP_CHANNEL_IDS.join(
      ','
    )}`,
    options: {
      orderBy: ['release_time'],
      pageSize: 4,
      channelIds: [''],
    },
    hideRepostLabel: true,
  };

  const BIDEN_CHANNEL_IDS = [];

  const BIDEN = {
    title: __('Joe Biden 🍌 #2020 Election 🇺🇸'),
    link: `/$/${PAGES.DISCOVER}?${CS.CLAIM_TYPE}=${CS.CLAIM_STREAM}&${CS.CHANNEL_IDS_KEY}=${BIDEN_CHANNEL_IDS.join(
      ','
    )}`,
    options: {
      orderBy: ['release_time'],
      pageSize: 4,
      channelIds: [''],
    },
    hideRepostLabel: true,
  };

  const GAMING_CHANNEL_IDS = [
    'b7d204c8ac9b0b5df4ffc4350afa432bf579543e',
    '02c020b2fab7dd1fbd175c3b22947688c0a219e5',
    'e8c71ade66ffb2cd7be3fa08f1d0a19ac70bfc65',
    '15c88c561f7e4c4cdd6fb4e32c35e593db09a8a4',
    '1d729d8a4bbed9f3e9bec0cf1e958980569b0681',
    '514df20b9d2cce22725d5305a8ba019547188736',
    '199eba05b6ecccab919e26a0cb7dacd544f25700',
    'ff9dddaef1f0c7938d7a4a170abef24c70e4cec7',
    '164845c52a9407f3406494f87523f2956c2b7936',
    '3a3af9d672ad2166737758f4e35ac6fd6f1235f9',
    'ee09d6c4ac3fbfc99635875d18f2aa98037d2602',
    'd746ac8d782f94d12d176c7a591f5bf8365bef3d',
    '520de75a0373643c14168536940e596ff8ece24c',
  ];

  const GAMING = {
    title: __('Gaming'),
    link: `/$/${PAGES.DISCOVER}?${CS.CLAIM_TYPE}=${CS.CLAIM_STREAM}&${CS.CHANNEL_IDS_KEY}=${GAMING_CHANNEL_IDS.join(
      ','
    )}`,
    options: {
      orderBy: ['release_time'],
      pageSize: 8,
      channelIds: GAMING_CHANNEL_IDS,
    },
  };

  const COMMUNITY_CHANNEL_IDS = [
    'b36f5f628e63c2c8a0d063c2be08c1f004984d68',
    '90b566f5aca9c9a3b23b56cf6d75c07493737bc9',
    '1aa69a21a8d7e7bab3f9366aba52936e3ddc5330',
    '1cdb5d0bdcb484907d0a2fea4efdfe0153838642',
    '55f552c153a6922798ce9f6d429b69c87c4c992a',
    'b516294f541a18ce00b71a60b2c82ad2f87ff78d',
    'ca43e7e24420ff5276694b8251643efd97271be1',
    '297abfc0e8d63be217952ef20206a447de677d84',
    '89985db232ec2a9a31dbd985196de817da223fe6',
    '187bf3616318b4bfb85223fc40724c307696f0c6',
    'c7d2d5150a331e1696d95abb9a7b59d837c4e5a1',
    'f33657a2fcbab2dc3ce555d5d6728f8758af7bc7',
    '5097b175c4c58c431424ce3b60901de6ae650127',
    '49f1876b382a69414a330995908e326c7b96c132',
    '1d729d8a4bbed9f3e9bec0cf1e958980569b0681',
    '294f5c164da5ac9735658b2d58d8fee6745dfc45',
    'e8b0d5e34558b8a852374fd40af1c0150a65504b',
    'c2b6c8f86dedbae881117718f5d37250f6da2564',
    'ebdee96e9a17c9e5fe7627cc644eb75bd068a6ec',
    'e50f82e2236274c54af762a9c2b897646477ef62',
    '797a528c49b6535560f7fd8222b121b0223287c8',
    '935e7ed2c8b2a184ba2f39167f0201a74910235b',
    'e80e3070d5c82d934f09d439fb9ca9eca5e155b8',
    '3fec094c5937e9eb4e8f5e71e4ca430e8a993d03',
    '7317777e3751efa66218f6da5ef0d01dda69af48',
    'a757e39ff8abb2e2f13e88c9b7ad0105ea459ed9',
    'a2e1bb1fed32c6a6290b679785dd31ca5c59cb5f',
    'c64f446ba359272f36c5b4abe02109d0a25bbbef',
    '26b498d808f8ed9955caaf7e27cef31b20b2c87a',
    '58b9503ee85cf5bb5268b4fd75644ea17b6c0d5d',
    'df961194a798cc76306b9290701130c592530fb6',
    'd34376986bc857846993ff0aa750875bf7cf1b4a',
    '0831bef6095a57ec440f626aac2a650a20282945',
  ];

  const COMMUNITY = {
    title: __('Nice People'),
    link: `/$/${PAGES.DISCOVER}?${CS.CLAIM_TYPE}=${CS.CLAIM_STREAM}&${CS.CHANNEL_IDS_KEY}=${COMMUNITY_CHANNEL_IDS.join(
      ','
    )}`,
    options: {
      orderBy: ['release_time'],
      pageSize: 8,
      channelIds: COMMUNITY_CHANNEL_IDS,
      release_time: `>${Math.floor(
        moment()
          .subtract(6, 'months')
          .startOf('week')
          .unix()
      )}`,
    },
  };

  const TECHNOLOGY_CHANNEL_IDS = [
    'fdc3b71d6e99fe305863ac72721637d2ce49d1ad',
    '8cbef9a7778b528a6183b4bb25bb748bf016b7ca',
    '70d6386888708ce5559ca225120b2801f6e052bd',
    '3e465c0163d8ab5635edb49e6f8f3933fa9cf42a',
    '78d20123fdf5fbcfa2b2a5b71875a3e7e37a8d41',
    '12f1f69fe070a79d171c5964e5a1053b26cb6df6',
    '55f552c153a6922798ce9f6d429b69c87c4c992a',
    '4f0686070ce0ec410ffa10bd46682f54b8d6d94c',
    'f33657a2fcbab2dc3ce555d5d6728f8758af7bc7',
    '2f229d3ac26aa655c5123c29f1f7352403279ca3',
    '8539673ff55e10a7ef2859d16194ad92c4d3a412',
    '5af39f818f668d8c00943c9326c5201c4fe3c423',
    '7b23cca3f49059f005e812be03931c81272eaac4',
    '70645fd323c8730d7fab5528e4fa5883ecebe78a',
    'fba22d346111304c39b51ffc2740238a1449e5fd',
    '3e465c0163d8ab5635edb49e6f8f3933fa9cf42a',
    'd9535951222dd7a1ff7f763872cb0df44f7962bf',
    '3818d442f75be9c3685b6ad58e5ceb8569ade5ee',
    '87b2669c65c60a36aa408f0177517a192db194a7',
    '48c7ea8bc2c4adba09bf21a29689e3b8c2967522',
    '2a6194792beac5130641e932b5ac6e5a99b5ca4f',
    '6e29e20a77e1a6181e60ca19b0f83e8223416aa8',
    '918be99daff84a69e1458cfabfda219f2a05271b',
    '0afddbd02b7068c89d0bce77a0481875c159115f',
    'cda82633c939eb0d605c148277669cfe53cf2b72',
    'd2d3ac174a107b846f497be701e232539c4511f1',
  ];

  const TECHNOLOGY = {
    title: __('Technology'),
    link: `/$/${PAGES.DISCOVER}?${CS.CLAIM_TYPE}=${CS.CLAIM_STREAM}&${CS.CHANNEL_IDS_KEY}=${TECHNOLOGY_CHANNEL_IDS.join(
      ','
    )}`,
    options: {
      orderBy: ['release_time'],
      pageSize: 8,
      channelIds: TECHNOLOGY_CHANNEL_IDS,
    },
  };

  //   const PROTESTS_2020 = {
  //     title: '#2020protests',
  //     link: `/$/${PAGES.DISCOVER}?${CS.TAGS_KEY}=2020protests&${CS.CLAIM_TYPE}=${CS.CLAIM_STREAM}`,
  //     options: {
  //       claimType: ['stream'],
  //       tags: ['2020protests'],
  //       pageSize: 4,
  //     },
  //   };

  //   const TOP_CHANNELS = {
  //     title: __('Top Channels On LBRY'),
  //     link: `/$/${PAGES.DISCOVER}?claim_type=channel&${CS.ORDER_BY_KEY}=${CS.ORDER_BY_TOP}&${CS.FRESH_KEY}=${CS.FRESH_ALL}`,
  //     options: {
  //       orderBy: ['effective_amount'],
  //       claimType: ['channel'],
  //     },
  //   };

  //   const TRENDING_ON_LBRY = {
  //     title: __('Trending On LBRY'),
  //     link: `/$/${PAGES.DISCOVER}`,
  //     options: {
  //       pageSize: showPersonalizedChannels || showPersonalizedTags ? 4 : 8,
  //     },
  //   };

  //   const TRENDING_FOR_TAGS = {
  //     title: __('Trending For Your Tags'),
  //     link: `/$/${PAGES.TAGS_FOLLOWING}`,
  //     options: {
  //       tags: followedTags.map(tag => tag.name),
  //       claimType: ['stream'],
  //     },
  //   };

  //   const LATEST_FROM_LBRY = {
  //     title: __('Latest From @lbry'),
  //     link: `/@lbry:3f`,
  //     options: {
  //       orderBy: ['release_time'],
  //       pageSize: 4,
  //       channelIds: ['3fda836a92faaceedfe398225fb9b2ee2ed1f01a'],
  //     },
  //   };

  //   const LATEST_FROM_LBRYCAST = {
  //     title: __('Latest From @lbrycast'),
  //     link: `/@lbrycast:4`,
  //     options: {
  //       orderBy: ['release_time'],
  //       pageSize: 4,
  //       channelIds: ['4c29f8b013adea4d5cca1861fb2161d5089613ea'],
  //     },
  //   };

  rowData.push(YOUTUBE_CREATOR_ROW);
  if (showPersonalizedChannels) rowData.push(RECENT_FROM_FOLLOWING);
  rowData.push(TRENDING_CLASSICS);
  rowData.push(TOP_CONTENT_TODAY);
  rowData.push(TRUMP);
  rowData.push(BIDEN);
  rowData.push(GAMING);
  rowData.push(COMMUNITY);
  rowData.push(TECHNOLOGY);

  //   if (showPersonalizedTags && !showIndividualTags) rowData.push(TRENDING_FOR_TAGS);
  //   if (showPersonalizedTags && showIndividualTags) {
  //     individualTagDataItems.forEach((item: RowDataItem) => {
  //       rowData.push(item);
  //     });
  //   }
  //   rowData.push(PROTESTS_2020);
  //   rowData.push(TRENDING_ON_LBRY);
  //   rowData.push(LATEST_FROM_LBRY);
  //   rowData.push(LATEST_FROM_LBRYCAST);
  //   if (!showPersonalizedChannels) rowData.push(TOP_CHANNELS);

  return rowData;
}
