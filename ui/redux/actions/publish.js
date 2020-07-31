// @flow
import * as MODALS from 'constants/modal_types';
import * as ACTIONS from 'constants/action_types';
import * as PAGES from 'constants/pages';
import {
  batchActions,
  selectMyClaims,
  doPublish,
  doCheckPendingClaims,
  doCheckReflectingFiles,
  ACTIONS as LBRY_REDUX_ACTIONS,
} from 'lbry-redux';
import { doError } from 'redux/actions/notifications';
import { push } from 'connected-react-router';
import analytics from 'analytics';
import { doOpenModal } from './app';

export const doPublishDesktop = (filePath: string, preview?: boolean) => (dispatch: Dispatch, getState: () => {}) => {
  const publishPreview = previewResponse => {
    dispatch(
      doOpenModal(MODALS.PUBLISH_PREVIEW, {
        previewResponse,
      })
    );
  };

  const publishSuccess = (successResponse, lbryFirstError) => {
    const state = getState();
    const myClaims = selectMyClaims(state);
    const pendingClaim = successResponse.outputs[0];
    analytics.apiLogPublish(pendingClaim);
    const { permanent_url: url } = pendingClaim;
    const actions = [];

    // @if TARGET='app'
    actions.push(push(`/$/${PAGES.UPLOADS}`));
    // @endif

    actions.push({
      type: ACTIONS.PUBLISH_SUCCESS,
    });
    // We have to fake a temp claim until the new pending one is returned by claim_list_mine
    // We can't rely on claim_list_mine because there might be some delay before the new claims are returned
    // Doing this allows us to show the pending claim immediately, it will get overwritten by the real one
    const isMatch = claim => claim.claim_id === pendingClaim.claim_id;
    const isEdit = myClaims.some(isMatch);

    actions.push({
      type: LBRY_REDUX_ACTIONS.UPDATE_PENDING_CLAIMS,
      data: {
        claims: [pendingClaim],
      },
    });
    // @if TARGET='app'
    actions.push({
      type: LBRY_REDUX_ACTIONS.ADD_FILES_REFLECTING,
      data: pendingClaim,
    });
    // @endif

    dispatch(batchActions(...actions));
    dispatch(
      doOpenModal(MODALS.PUBLISH, {
        uri: url,
        isEdit,
        filePath,
        lbryFirstError,
      })
    );
    dispatch(doCheckPendingClaims());
    // @if TARGET='app'
    dispatch(doCheckReflectingFiles());
    // @endif
  };

  const publishFail = error => {
    const actions = [];
    actions.push({
      type: ACTIONS.PUBLISH_FAIL,
    });
    actions.push(doError(error.message));
    dispatch(batchActions(...actions));
  };

  if (preview) {
    dispatch(doPublish(publishSuccess, publishFail, publishPreview));
    return;
  }

  // Redirect on web immediately because we have a file upload progress componenet
  // on the publishes page. This doesn't exist on desktop so wait until we get a response
  // from the SDK
  // @if TARGET='web'
  dispatch(push(`/$/${PAGES.UPLOADS}`));
  // @endif

  dispatch(doPublish(publishSuccess, publishFail));
};
