// @flow
import * as ACTIONS from 'constants/action_types';
import { doClaimSearch } from 'lbry-redux';
import { LIVESTREAM_LIVE_API } from 'constants/livestream';

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

export const doFetchActiveLivestreams = (
  orderBy: Array<string> = ['release_time'],
  pageSize: number = 50,
  forceFetch: boolean = false
) => {
  return async (dispatch: Dispatch, getState: GetState) => {
    const state = getState();
    const now = Date.now();
    const timeDelta = now - state.livestream.activeLivestreamsLastFetchedDate;

    const prevOptions = state.livestream.activeLivestreamsLastFetchedOptions;
    const nextOptions = { page_size: pageSize, order_by: orderBy };
    const sameOptions = JSON.stringify(prevOptions) === JSON.stringify(nextOptions);

    if (!forceFetch && sameOptions && timeDelta < FETCH_ACTIVE_LIVESTREAMS_MIN_INTERVAL_MS) {
      dispatch({ type: ACTIONS.FETCH_ACTIVE_LIVESTREAMS_SKIPPED });
      return;
    }

    dispatch({ type: ACTIONS.FETCH_ACTIVE_LIVESTREAMS_STARTED });

    fetch(LIVESTREAM_LIVE_API)
      .then((res) => res.json())
      .then((res) => {
        if (!res.data) {
          dispatch({ type: ACTIONS.FETCH_ACTIVE_LIVESTREAMS_FAILED });
          return;
        }

        const activeLivestreams: LivestreamInfo = res.data.reduce((acc, curr) => {
          acc[curr.claimId] = {
            live: curr.live,
            viewCount: curr.viewCount,
            creatorId: curr.claimId,
          };
          return acc;
        }, {});

        dispatch(
          // ** Creators can have multiple livestream claims (each with unique
          // chat), and all of them will play the same stream when creator goes
          // live. The UI usually just wants to report the latest claim, so we
          // query that store it in `latestClaimUri`.
          doClaimSearch({
            page_size: nextOptions.page_size,
            has_no_source: true,
            channel_ids: Object.keys(activeLivestreams),
            claim_type: ['stream'],
            order_by: nextOptions.order_by, // **
            limit_claims_per_channel: 1, // **
            no_totals: true,
          })
        )
          .then((resolveInfo) => {
            Object.values(resolveInfo).forEach((x) => {
              // $FlowFixMe
              const channelId = x.stream.signing_channel.claim_id;
              activeLivestreams[channelId] = {
                ...activeLivestreams[channelId],
                // $FlowFixMe
                latestClaimId: x.stream.claim_id,
                // $FlowFixMe
                latestClaimUri: x.stream.canonical_url,
              };
            });

            dispatch({
              type: ACTIONS.FETCH_ACTIVE_LIVESTREAMS_COMPLETED,
              data: {
                activeLivestreams,
                activeLivestreamsLastFetchedDate: now,
                activeLivestreamsLastFetchedOptions: nextOptions,
              },
            });
          })
          .catch(() => {
            dispatch({ type: ACTIONS.FETCH_ACTIVE_LIVESTREAMS_FAILED });
          });
      })
      .catch((err) => {
        dispatch({ type: ACTIONS.FETCH_ACTIVE_LIVESTREAMS_FAILED });
      });
  };
};
