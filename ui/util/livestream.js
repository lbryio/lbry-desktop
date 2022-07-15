// @flow
import { NEW_LIVESTREAM_LIVE_API, LIVESTREAM_KILL, LIVESTREAM_STARTS_SOON_BUFFER } from 'constants/livestream';
import { toHex } from 'util/hex';
import Lbry from 'lbry';
import moment from 'moment';

export const LiveStatus = Object.freeze({
  LIVE: 'LIVE',
  NOT_LIVE: 'NOT_LIVE',
  UNKNOWN: 'UNKNOWN',
});

type LiveStatusType = $Keys<typeof LiveStatus>;

type LiveChannelStatus = {
  channelStatus: LiveStatusType,
  channelData?: LivestreamInfo,
};

type StreamData = {
  d: string,
  s: string,
  t: string,
};

/**
 * Helper to extract livestream claim uris from the output of
 * `selectActiveLivestreams`.
 *
 * @param activeLivestreams Object obtained from `selectActiveLivestreams`.
 * @param channelIds List of channel IDs to filter the results with.
 * @param excludedChannelIds
 * @returns {[]|Array<*>}
 */
export function getLivestreamUris(
  activeLivestreams: ?LivestreamInfo,
  channelIds: ?Array<string>,
  excludedChannelIds?: Array<string>
) {
  let values = (activeLivestreams && Object.values(activeLivestreams)) || [];

  if (channelIds && channelIds.length > 0) {
    // $FlowFixMe
    values = values.filter((v) => channelIds.includes(v?.creatorId) && Boolean(v?.claimUri));
  } else {
    // $FlowFixMe
    values = values.filter((v) => Boolean(v?.claimUri));
  }

  if (excludedChannelIds) {
    // $FlowFixMe
    values = values.filter((v) => !excludedChannelIds.includes(v.creatorId));
  }

  values = values.sort((a, b) => {
    // $FlowFixMe
    if (a.viewCount < b.viewCount) return 1;
    // $FlowFixMe
    else if (a.viewCount > b.viewCount) return -1;
    else return 0;
  });

  // $FlowFixMe
  return values.map((v) => v.claimUri);
}

export function getTipValues(superChatsByAmount: Array<Comment>) {
  let superChatsChannelUrls = [];
  let superChatsFiatAmount = 0;
  let superChatsLBCAmount = 0;

  if (superChatsByAmount) {
    superChatsByAmount.forEach((superChat) => {
      const { is_fiat: isFiat, support_amount: tipAmount, channel_url: uri } = superChat;

      if (isFiat) {
        superChatsFiatAmount = superChatsFiatAmount + tipAmount;
      } else {
        superChatsLBCAmount = superChatsLBCAmount + tipAmount;
      }
      superChatsChannelUrls.push(uri || '0');
    });
  }

  return { superChatsChannelUrls, superChatsFiatAmount, superChatsLBCAmount };
}

const transformNewLivestreamData = (data: Array<any>): LivestreamInfo => {
  return data.reduce((acc, curr) => {
    acc[curr.ChannelClaimID] = {
      url: curr.VideoURL,
      type: 'application/x-mpegurl',
      live: curr.Live,
      viewCount: curr.ViewerCount,
      creatorId: curr.ChannelClaimID,
      startedStreaming: moment(curr.Start),
    };
    return acc;
  }, {});
};

export const fetchLiveChannels = async (): Promise<LivestreamInfo> => {
  const newApiResponse = await fetch(`${NEW_LIVESTREAM_LIVE_API}/all`);
  const newApiData = (await newApiResponse.json()).data;
  if (!newApiData) throw new Error();

  return transformNewLivestreamData(newApiData);
};

/**
 * Check whether or not the channel is used, used for long polling to display live status on claim viewing page
 * @param channelId
 * @returns {Promise<{channelStatus: string}|{channelData: LivestreamInfo, channelStatus: string}>}
 */
export const fetchLiveChannel = async (channelId: string): Promise<LiveChannelStatus> => {
  const newApiEndpoint = NEW_LIVESTREAM_LIVE_API;
  const newApiResponse = await fetch(`${newApiEndpoint}/is_live?channel_claim_id=${channelId}`);
  const newApiData = (await newApiResponse.json()).data;
  const isLive = newApiData.Live;
  const translatedData = transformNewLivestreamData([newApiData]);

  try {
    if (isLive === false) {
      return { channelStatus: LiveStatus.NOT_LIVE };
    }
    return {
      channelStatus: LiveStatus.LIVE,
      channelData: translatedData,
    };
  } catch {
    return { channelStatus: LiveStatus.UNKNOWN };
  }
};

const getStreamData = async (channelId: string, channelName: string): Promise<StreamData> => {
  if (!channelId || !channelName) throw new Error('Invalid channel data provided.');

  const channelNameHex = toHex(channelName);
  let channelSignature;

  try {
    channelSignature = await Lbry.channel_sign({ channel_id: channelId, hexdata: channelNameHex });
    if (!channelSignature || !channelSignature.signature || !channelSignature.signing_ts) {
      throw new Error('Error getting channel signature.');
    }
  } catch (e) {
    throw e;
  }

  return { d: channelNameHex, s: channelSignature.signature, t: channelSignature.signing_ts };
};

export const killStream = async (channelId: string, channelName: string) => {
  try {
    const streamData = await getStreamData(channelId, channelName);

    const encodedChannelName = encodeURIComponent(channelName);

    const apiData = await fetch(
      `${LIVESTREAM_KILL}channel_claim_id=${channelId}&channel_name=${encodedChannelName}&signature_ts=${streamData.t}&signature=${streamData.s}`
    );

    const data = (await apiData.json()).data;

    if (!data) throw new Error('Kill stream API failed.');
  } catch (e) {
    throw e;
  }
};

const distanceFromStreamStart = (claimA: any, claimB: any, channelStartedStreaming) => {
  return [
    Math.abs(moment.unix(claimA.stream.value.release_time).diff(channelStartedStreaming, 'minutes')),
    Math.abs(moment.unix(claimB.stream.value.release_time).diff(channelStartedStreaming, 'minutes')),
  ];
};

export const determineLiveClaim = (claims: any, activeLivestreams: any) => {
  const activeClaims = {};

  Object.values(claims).forEach((claim: any) => {
    const channelID = claim.stream.signing_channel.claim_id;
    if (activeClaims[channelID]) {
      const [distanceA, distanceB] = distanceFromStreamStart(
        claim,
        activeClaims[channelID],
        activeLivestreams[channelID].startedStreaming
      );

      if (distanceA < distanceB) {
        activeClaims[channelID] = claim;
      }
    } else {
      activeClaims[channelID] = claim;
    }
  });
  return activeClaims;
};

export const filterUpcomingLiveStreamClaims = (upcomingClaims: any) => {
  const startsSoonMoment = moment().startOf('minute').add(LIVESTREAM_STARTS_SOON_BUFFER, 'minutes');
  const startingSoonClaims = {};

  Object.keys(upcomingClaims).forEach((key) => {
    if (moment.unix(upcomingClaims[key].stream.value.release_time).isSameOrBefore(startsSoonMoment)) {
      startingSoonClaims[key] = upcomingClaims[key];
    }
  });

  return startingSoonClaims;
};
