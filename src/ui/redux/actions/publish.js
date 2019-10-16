// @flow
import * as MODALS from 'constants/modal_types';
import { batchActions, doError, selectMyClaims, doPublish, doCheckPendingPublishes } from 'lbry-redux';
import * as ACTIONS from 'constants/action_types';
import { selectosNotificationsEnabled } from 'redux/selectors/settings';
import { push } from 'connected-react-router';
import analytics from 'analytics';
import { formatLbryUriForWeb } from 'util/uri';
import { doOpenModal } from './app';

export const doPublishDesktop = () => (dispatch: Dispatch, getState: () => {}) => {
  const publishSuccess = successResponse => {
    const state = getState();
    const myClaims = selectMyClaims(state);
    const pendingClaim = successResponse.outputs[0];
    analytics.apiLogPublish(pendingClaim);
    const { permanent_url: url } = pendingClaim;
    const actions = [];

    actions.push({
      type: ACTIONS.PUBLISH_SUCCESS,
    });
    // We have to fake a temp claim until the new pending one is returned by claim_list_mine
    // We can't rely on claim_list_mine because there might be some delay before the new claims are returned
    // Doing this allows us to show the pending claim immediately, it will get overwritten by the real one
    const isMatch = claim => claim.claim_id === pendingClaim.claim_id;
    const isEdit = myClaims.some(isMatch);

    const myNewClaims = isEdit
      ? myClaims.map(claim => (isMatch(claim) ? pendingClaim : claim))
      : myClaims.concat(pendingClaim);
    actions.push(doOpenModal(MODALS.PUBLISH, { uri: url, isEdit }));
    actions.push({
      type: ACTIONS.FETCH_CLAIM_LIST_MINE_COMPLETED,
      data: {
        claims: myNewClaims,
      },
    });
    dispatch(batchActions(...actions));
  };

  const publishFail = error => {
    const actions = [];
    actions.push({ type: ACTIONS.PUBLISH_FAIL });
    actions.push(doError(error.message));
    dispatch(batchActions(...actions));
  };

  return dispatch(doPublish(publishSuccess, publishFail));
};

// Calls claim_list_mine until any pending publishes are confirmed
export const doCheckPendingPublishesApp = () => (dispatch: Dispatch, getState: GetState) => {
  const onConfirmed = claim => {
    if (selectosNotificationsEnabled(getState())) {
      const notif = new window.Notification('LBRY Publish Complete', {
        body: __('%nameOrTitle% has been published to lbry://%name%. Click here to view it.', {
          nameOrTitle: claim.value_type === 'channel' ? `@${claim.name}` : claim.value.title,
          name: claim.name,
        }),
        silent: false,
      });
      notif.onclick = () => {
        dispatch(push(formatLbryUriForWeb(claim.permanent_url)));
      };
    }
  };
  return dispatch(doCheckPendingPublishes(onConfirmed));
};
