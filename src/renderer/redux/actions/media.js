// @flow
import * as actions from 'constants/action_types';
import type { Action, Dispatch } from 'redux/reducers/media';
import lbry from 'lbry';
import { makeSelectClaimForUri } from 'redux/selectors/claims';

export const doPlay = () => (dispatch: Dispatch) =>
  dispatch({
    type: actions.MEDIA_PLAY,
  });

export const doPause = () => (dispatch: Dispatch) =>
  dispatch({
    type: actions.MEDIA_PAUSE,
  });

export function savePosition(claimId: String, position: Number) {
  return function(dispatch: Dispatch, getState: Function) {
    const state = getState();
    const claim = state.claims.byId[claimId];
    const outpoint = `${claim.txid}:${claim.nout}`;
    dispatch({
      type: actions.MEDIA_POSITION,
      data: {
        outpoint,
        position,
      },
    });
  };
}
