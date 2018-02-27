import Lbry from 'lbry';
import * as ACTIONS from 'constants/action_types';
import * as MODALS from 'constants/modal_types';
import { doFetchClaimListMine } from 'redux/actions/content';
import { selectMyClaimsWithoutChannels } from 'redux/selectors/claims';
import { selectPendingPublishes } from 'redux/selectors/publish';
import { doOpenModal } from 'redux/actions/app';
import type { UpdatePublishFormData, UpdatePublishFormAction, PublishParams } from 'redux/reducers/publish';
export type Action =
  UpdatePublishFormAction
  | { type: ACTIONS.CLEAR_PUBLISH }

type PromiseAction = Promise<Action>;
export type Dispatch = (action: Action | PromiseAction | Array<Action>) => any;
type ThunkAction = (dispatch: Dispatch) => any;

export const doClearPublish = () => (dispatch: Dispatch): Action =>
  dispatch({ type: ACTIONS.CLEAR_PUBLISH });

export const doUpdatePublishForm = (publishFormValue: {}): Action => (dispatch: Dispatch): Action =>
  dispatch({ type: ACTIONS.UPDATE_PUBLISH_FORM, data: { ...publishFormValue }})

export const doPublish = (params: PublishParams): Action => {
  const {
    name,
    bid,
    filePath: file_path,
    description,
    language,
    license,
    licenseUrl,
    thumbnail,
    nsfw,
    channel,
    title,
    contentIsFree,
    price,
    uri
  } = params;

  const channel_name = (channel === 'anonymous' || channel === 'new') ? '' : channel;
  const fee = contentIsFree || !price.amount ? undefined : { ...price };

  const metadata = {
    title,
    nsfw,
    license,
    licenseUrl,
    language,
  }

  if (fee) {
    metadata.fee = fee;
  }

  if (description) {
    metadata.description = description;
  }

  const publishPayload = {
    file_path,
    name,
    channel_name,
    bid,
    metadata
  }

  return dispatch => {
    dispatch({ type: ACTIONS.PUBLISH_START });

    const success = () => {
      dispatch({ type: ACTIONS.PUBLISH_SUCCESS, data: { pendingPublish: publishPayload } });
      dispatch(doOpenModal(MODALS.PUBLISH, { uri }))
    };

    const failure = error => {
      dispatch({ type: ACTIONS.PUBLISH_FAIL })
      dispatch(doOpenModal(MODALS.ERROR, { error: error.message }))
    };

    return Lbry.publish(publishPayload).then(success, failure);
  }
}

// Calls claim_list_mine until any pending publishes are confirmed
export const doCheckPendingPublishes = () => {
  return (dispatch, getState) => {
    const state = getState();
    const pendingPublishes = selectPendingPublishes(state);
    const myClaims = selectMyClaimsWithoutChannels(state);

    let publishCheckInterval;

    const checkFileList = () => {
      Lbry.claim_list_mine().then(claims => {
        const claimsWithoutChannels = claims.filter(claim => !claim.name.match(/^@/));
        if (myClaims.length !== claimsWithoutChannels.length) {
          const pendingPublishMap = {};
          pendingPublishes.forEach(({ name }) => {
            pendingPublishMap[name] = name;
          });

          claims.forEach((claim) => {
            if (pendingPublishMap[claim.name]) {
              dispatch({
                type: ACTIONS.REMOVE_PENDING_PUBLISH,
                data: {
                  name: claim.name
                }
              });
              dispatch({
                type: ACTIONS.FETCH_CLAIM_LIST_MINE_COMPLETED,
                data: {
                  claims,
                },
              });

              delete pendingPublishMap[claim.name];
            }
          });

          clearInterval(publishCheckInterval);
        }
      });
    }

    if (pendingPublishes.length) {
      checkFileList();
      publishCheckInterval = setInterval(() => {
        checkFileList();
      }, 10000)
    }
  };
}
