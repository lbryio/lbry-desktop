// @flow
import * as ACTIONS from 'constants/action_types';
import { doClaimSearch } from 'redux/actions/claims';
import { LIVESTREAM_LIVE_API, LIVESTREAM_STARTS_SOON_BUFFER } from 'constants/livestream';
import moment from 'moment';

const LiveStatus = Object.freeze({
  LIVE: 'LIVE',
  NOT_LIVE: 'NOT_LIVE',
  UNKNOWN: 'UNKNOWN',
});

type LiveStatusType = $Keys<typeof LiveStatus>;

type LiveChannelStatus = { channelStatus: LiveStatusType, channelData?: LivestreamInfo };

export const doFetchNoSourceClaims = (channelId: string) => async (dispatch: Dispatch, getState: GetState) => {
  dispatch({
    type: ACTIONS.FETCH_NO_SOURCE_CLAIMS_STARTED,
    data: channelId,
  });
  try {
    await dispatch(
      doClaimSearch({
        channel_ids: [channelId],
        has_no_source: true,
        claim_type: ['stream'],
        no_totals: true,
        page_size: 20,
        page: 1,
        include_is_my_output: true,
      })
    );

    dispatch({
      type: ACTIONS.FETCH_NO_SOURCE_CLAIMS_COMPLETED,
      data: channelId,
    });
  } catch (error) {
    dispatch({
      type: ACTIONS.FETCH_NO_SOURCE_CLAIMS_FAILED,
      data: channelId,
    });
  }
};

const FETCH_ACTIVE_LIVESTREAMS_MIN_INTERVAL_MS = 5 * 60 * 1000;

const transformLivestreamData = (data: Array<any>): LivestreamInfo => {
  return data.reduce((acc, curr) => {
    acc[curr.claimId] = {
      live: curr.live,
      viewCount: curr.viewCount,
      creatorId: curr.claimId,
      startedStreaming: moment(curr.timestamp),
    };
    return acc;
  }, {});
};

const fetchLiveChannels = async (): Promise<LivestreamInfo> => {
  const response = await fetch(LIVESTREAM_LIVE_API);
  const json = await response.json();
  if (!json.data) throw new Error();
  return transformLivestreamData(json.data);
};

const fetchLiveChannel = async (channelId: string): Promise<LiveChannelStatus> => {
  try {
    const response = await fetch(`${LIVESTREAM_LIVE_API}/${channelId}`);
    const json = await response.json();
    if (json.data?.live === false) return { channelStatus: LiveStatus.NOT_LIVE };
    return { channelStatus: LiveStatus.LIVE, channelData: transformLivestreamData([json.data]) };
  } catch {
    return { channelStatus: LiveStatus.UNKNOWN };
  }
};

const filterUpcomingLiveStreamClaims = (upcomingClaims) => {
  const startsSoonMoment = moment().startOf('minute').add(LIVESTREAM_STARTS_SOON_BUFFER, 'minutes');
  const startingSoonClaims = {};
  Object.keys(upcomingClaims).forEach((key) => {
    if (moment.unix(upcomingClaims[key].stream.value.release_time).isSameOrBefore(startsSoonMoment)) {
      startingSoonClaims[key] = upcomingClaims[key];
    }
  });
  return startingSoonClaims;
};

const fetchUpcomingLivestreamClaims = (channelIds: Array<string>, lang: ?Array<string> = null) => {
  return doClaimSearch(
    {
      page: 1,
      page_size: 50,
      has_no_source: true,
      channel_ids: channelIds,
      claim_type: ['stream'],
      order_by: ['^release_time'],
      release_time: `>${moment().subtract(5, 'minutes').unix()}`,
      limit_claims_per_channel: 1,
      no_totals: true,
      ...(lang ? { any_languages: lang } : {}),
    },
    {
      useAutoPagination: true,
    }
  );
};

const fetchMostRecentLivestreamClaims = (
  channelIds: Array<string>,
  orderBy: Array<string> = ['release_time'],
  lang: ?Array<string> = null
) => {
  return doClaimSearch(
    {
      page: 1,
      page_size: 50,
      has_no_source: true,
      channel_ids: channelIds,
      claim_type: ['stream'],
      order_by: orderBy,
      release_time: `<${moment().unix()}`,
      limit_claims_per_channel: 2,
      no_totals: true,
      ...(lang ? { any_languages: lang } : {}),
    },
    {
      useAutoPagination: true,
    }
  );
};

const distanceFromStreamStart = (claimA: any, claimB: any, channelStartedStreaming) => {
  return [
    Math.abs(moment.unix(claimA.stream.value.release_time).diff(channelStartedStreaming, 'minutes')),
    Math.abs(moment.unix(claimB.stream.value.release_time).diff(channelStartedStreaming, 'minutes')),
  ];
};

const determineLiveClaim = (claims: any, activeLivestreams: any) => {
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

const findActiveStreams = async (
  channelIDs: Array<string>,
  orderBy: Array<string>,
  liveChannels: any,
  dispatch,
  lang: ?Array<string> = null
) => {
  // @Note: This can likely be simplified down to one query, but first we'll need to address the query limit / pagination issue.

  // Find the two most recent claims for the channels that are actively broadcasting a stream.
  const mostRecentClaims = await dispatch(fetchMostRecentLivestreamClaims(channelIDs, orderBy, lang));

  // Find the first upcoming claim (if one exists) for each channel that's actively broadcasting a stream.
  const upcomingClaims = await dispatch(fetchUpcomingLivestreamClaims(channelIDs, lang));

  // Filter out any of those claims that aren't scheduled to start within the configured "soon" buffer time (ex. next 5 min).
  const startingSoonClaims = filterUpcomingLiveStreamClaims(upcomingClaims);

  // Reduce the claim list to one "live" claim per channel, based on how close each claim's
  // release time is to the time the channels stream started.
  const allClaims = Object.assign({}, mostRecentClaims, startingSoonClaims);

  return determineLiveClaim(allClaims, liveChannels);
};

export const doFetchChannelLiveStatus = (channelId: string) => {
  return async (dispatch: Dispatch) => {
    try {
      const { channelStatus, channelData } = await fetchLiveChannel(channelId);

      if (channelStatus === LiveStatus.NOT_LIVE) {
        dispatch({ type: ACTIONS.REMOVE_CHANNEL_FROM_ACTIVE_LIVESTREAMS, data: { channelId } });
        return;
      }
      if (channelStatus === LiveStatus.UNKNOWN) {
        return;
      }

      const currentlyLiveClaims = await findActiveStreams([channelId], ['release_time'], channelData, dispatch);
      const liveClaim = currentlyLiveClaims[channelId];

      if (channelData && liveClaim) {
        channelData[channelId].claimId = liveClaim.stream.claim_id;
        channelData[channelId].claimUri = liveClaim.stream.canonical_url;
        dispatch({ type: ACTIONS.ADD_CHANNEL_TO_ACTIVE_LIVESTREAMS, data: { ...channelData } });
      }
    } catch (err) {
      dispatch({ type: ACTIONS.REMOVE_CHANNEL_FROM_ACTIVE_LIVESTREAMS, data: { channelId } });
    }
  };
};

export const doFetchActiveLivestreams = (orderBy: Array<string> = ['release_time'], lang: ?Array<string> = null) => {
  return async (dispatch: Dispatch, getState: GetState) => {
    const state = getState();
    const now = Date.now();
    const timeDelta = now - state.livestream.activeLivestreamsLastFetchedDate;

    const prevOptions = state.livestream.activeLivestreamsLastFetchedOptions;
    const nextOptions = { order_by: orderBy, ...(lang ? { any_languages: lang } : {}) };
    const sameOptions = JSON.stringify(prevOptions) === JSON.stringify(nextOptions);

    if (sameOptions && timeDelta < FETCH_ACTIVE_LIVESTREAMS_MIN_INTERVAL_MS) {
      dispatch({ type: ACTIONS.FETCH_ACTIVE_LIVESTREAMS_SKIPPED });
      return;
    }

    dispatch({ type: ACTIONS.FETCH_ACTIVE_LIVESTREAMS_STARTED });

    try {
      const liveChannels = await fetchLiveChannels();
      const liveChannelIds = Object.keys(liveChannels);

      const currentlyLiveClaims = await findActiveStreams(
        liveChannelIds,
        nextOptions.order_by,
        liveChannels,
        dispatch,
        nextOptions.any_languages
      );
      Object.values(currentlyLiveClaims).forEach((claim: any) => {
        const channelId = claim.stream.signing_channel.claim_id;

        liveChannels[channelId] = {
          ...liveChannels[channelId],
          claimId: claim.stream.claim_id,
          claimUri: claim.stream.canonical_url,
        };
      });

      dispatch({
        type: ACTIONS.FETCH_ACTIVE_LIVESTREAMS_COMPLETED,
        data: {
          activeLivestreams: liveChannels,
          activeLivestreamsLastFetchedDate: now,
          activeLivestreamsLastFetchedOptions: nextOptions,
        },
      });
    } catch (err) {
      dispatch({ type: ACTIONS.FETCH_ACTIVE_LIVESTREAMS_FAILED });
    }
  };
};
