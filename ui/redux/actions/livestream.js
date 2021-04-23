// @flow
import * as ACTIONS from 'constants/action_types';
import { doClaimSearch } from 'lbry-redux';

export const doFetchNoSourceClaims = (channelId: string) => async (dispatch: Dispatch, getState: GetState) => {
  dispatch({
    type: ACTIONS.FETCH_NO_SOURCE_CLAIMS_STARTED,
    data: channelId,
  });

  const items = await dispatch(
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
  if (items) {
    dispatch({
      type: ACTIONS.FETCH_NO_SOURCE_CLAIMS_COMPLETED,
      data: channelId,
    });
  } else {
    dispatch({
      type: ACTIONS.FETCH_NO_SOURCE_CLAIMS_FAILED,
      data: channelId,
    });
  }
};
