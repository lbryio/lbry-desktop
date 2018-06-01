// @flow
import { ACTIONS, Lbry, selectMyClaimsWithoutChannels, doNotify, MODALS } from 'lbry-redux';
import { selectPendingPublishes } from 'redux/selectors/publish';
import type {
  UpdatePublishFormData,
  UpdatePublishFormAction,
  PublishParams,
} from 'redux/reducers/publish';

type Action = UpdatePublishFormAction | { type: ACTIONS.CLEAR_PUBLISH };
type PromiseAction = Promise<Action>;
type Dispatch = (action: Action | PromiseAction | Array<Action>) => any;
type GetState = () => {};

export const doClearPublish = () => (dispatch: Dispatch): Action =>
  dispatch({ type: ACTIONS.CLEAR_PUBLISH });

export const doUpdatePublishForm = (publishFormValue: UpdatePublishFormData) => (
  dispatch: Dispatch
): UpdatePublishFormAction =>
  dispatch({
    type: ACTIONS.UPDATE_PUBLISH_FORM,
    data: { ...publishFormValue },
  });

export const doPrepareEdit = (claim: any, uri: string) => (dispatch: Dispatch) => {
  const {
    name,
    amount,
    channel_name: channelName,
    value: {
      stream: { metadata },
    },
  } = claim;
  const {
    author,
    description,
    // use same values as default state
    // fee will be undefined for free content
    fee = {
      amount: 0,
      currency: 'LBC',
    },
    language,
    license,
    licenseUrl,
    nsfw,
    thumbnail,
    title,
  } = metadata;

  const publishData = {
    name,
    channel: channelName,
    bid: amount,
    price: { amount: fee.amount, currency: fee.currency },
    contentIsFree: !fee.amount,
    author,
    description,
    fee,
    language,
    license,
    licenseUrl,
    nsfw,
    thumbnail,
    title,
    uri,
  };

  dispatch({ type: ACTIONS.DO_PREPARE_EDIT, data: publishData });
};

export const doPublish = (params: PublishParams) => (dispatch: Dispatch, getState: () => {}) => {
  const state = getState();
  const myClaims = selectMyClaimsWithoutChannels(state);

  const {
    name,
    bid,
    filePath,
    description,
    language,
    license,
    licenseUrl,
    thumbnail,
    nsfw,
    channel,
    channelId,
    title,
    contentIsFree,
    price,
    uri,
    sources,
  } = params;

  let isEdit;
  const newPublishName = channel ? `${channel}/${name}` : name;
  for (let i = 0; i < myClaims.length; i += 1) {
    const { channel_name: claimChannelName, name: claimName } = myClaims[i];
    const contentName = claimChannelName ? `${claimChannelName}/${claimName}` : claimName;
    if (contentName === newPublishName) {
      isEdit = true;
      break;
    }
  }

  const fee = contentIsFree || !price.amount ? undefined : { ...price };

  const metadata = {
    title,
    nsfw,
    license,
    licenseUrl,
    language,
    thumbnail,
  };

  if (fee) {
    metadata.fee = fee;
  }

  if (description) {
    metadata.description = description;
  }

  const publishPayload = {
    name,
    channel_id: channelId,
    bid,
    metadata,
  };

  if (filePath) {
    publishPayload.file_path = filePath;
  } else {
    publishPayload.sources = sources;
  }

  dispatch({ type: ACTIONS.PUBLISH_START });

  const success = () => {
    dispatch({
      type: ACTIONS.PUBLISH_SUCCESS,
      data: { pendingPublish: { ...publishPayload, isEdit } },
    });
    dispatch(doNotify({ id: MODALS.PUBLISH }, { uri }));
  };

  const failure = error => {
    dispatch({ type: ACTIONS.PUBLISH_FAIL });
    dispatch(doNotify({ id: MODALS.ERROR, error: error.message }));
  };

  return Lbry.publish(publishPayload).then(success, failure);
};

// Calls claim_list_mine until any pending publishes are confirmed
export const doCheckPendingPublishes = () => (dispatch: Dispatch, getState: GetState) => {
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

        claims.forEach(claim => {
          if (pendingPublishMap[claim.name]) {
            dispatch({
              type: ACTIONS.REMOVE_PENDING_PUBLISH,
              data: {
                name: claim.name,
              },
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
  };

  if (pendingPublishes.length) {
    checkFileList();
    publishCheckInterval = setInterval(() => {
      checkFileList();
    }, 10000);
  }
};
