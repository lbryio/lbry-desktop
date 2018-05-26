// @flow
import * as actions from 'constants/action_types';
import type { Dispatch } from 'redux/reducers/media';

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

export const doShowOverlay = () => (dispatch: Dispatch) =>
  dispatch({
    type: actions.SHOW_OVERLAY_MEDIA,
  });

export const doHideOverlay = () => (dispatch: Dispatch) =>
  dispatch({
    type: actions.HIDE_OVERLAY_MEDIA,
  });
