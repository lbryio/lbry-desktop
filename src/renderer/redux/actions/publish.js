// @flow
import {
  ACTIONS,
  Lbry,
  doNotify,
  MODALS,
  selectMyChannelClaims,
  THUMBNAIL_STATUSES,
  batchActions,
} from 'lbry-redux';
import { selectPendingPublishes } from 'redux/selectors/publish';
import type {
  UpdatePublishFormData,
  UpdatePublishFormAction,
  PublishParams,
} from 'redux/reducers/publish';
import { selectosNotificationsEnabled } from 'redux/selectors/settings';
import { doNavigate } from 'redux/actions/navigation';
import fs from 'fs';
import path from 'path';

type Action = UpdatePublishFormAction | { type: ACTIONS.CLEAR_PUBLISH };
type PromiseAction = Promise<Action>;
type Dispatch = (action: Action | PromiseAction | Array<Action>) => any;
type GetState = () => {};

export const doClearPublish = () => (dispatch: Dispatch): PromiseAction => {
  dispatch({ type: ACTIONS.CLEAR_PUBLISH });
  return dispatch(doResetThumbnailStatus());
};

export const doUpdatePublishForm = (publishFormValue: UpdatePublishFormData) => (
  dispatch: Dispatch
): UpdatePublishFormAction =>
  dispatch({
    type: ACTIONS.UPDATE_PUBLISH_FORM,
    data: { ...publishFormValue },
  });

export const doResetThumbnailStatus = () => (dispatch: Dispatch): PromiseAction => {
  dispatch({
    type: ACTIONS.UPDATE_PUBLISH_FORM,
    data: {
      thumbnailPath: '',
    },
  });

  return fetch('https://spee.ch/api/config/site/publishing')
    .then(res => res.json())
    .then(status => {
      if (status.disabled) {
        throw Error();
      }

      return dispatch({
        type: ACTIONS.UPDATE_PUBLISH_FORM,
        data: {
          uploadThumbnailStatus: THUMBNAIL_STATUSES.READY,
          thumbnail: '',
          nsfw: false,
        },
      });
    })
    .catch(() =>
      dispatch({
        type: ACTIONS.UPDATE_PUBLISH_FORM,
        data: {
          uploadThumbnailStatus: THUMBNAIL_STATUSES.API_DOWN,
          thumbnail: '',
          nsfw: false,
        },
      })
    );
};

export const doUploadThumbnail = (filePath: string, nsfw: boolean) => (dispatch: Dispatch) => {
  const thumbnail = fs.readFileSync(filePath);
  const fileExt = path.extname(filePath);
  const fileName = path.basename(filePath);

  const makeid = () => {
    let text = '';
    const possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    for (let i = 0; i < 24; i += 1) text += possible.charAt(Math.floor(Math.random() * 62));
    return text;
  };

  const uploadError = (error = '') =>
    dispatch(
      batchActions(
        {
          type: ACTIONS.UPDATE_PUBLISH_FORM,
          data: { uploadThumbnailStatus: THUMBNAIL_STATUSES.API_DOWN },
        },
        dispatch(doNotify({ id: MODALS.ERROR, error }))
      )
    );

  dispatch({
    type: ACTIONS.UPDATE_PUBLISH_FORM,
    data: { uploadThumbnailStatus: THUMBNAIL_STATUSES.IN_PROGRESS },
  });

  const data = new FormData();
  const name = makeid();
  const file = new File([thumbnail], fileName, { type: `image/${fileExt.slice(1)}` });
  data.append('name', name);
  data.append('file', file);
  data.append('nsfw', nsfw.toString());
  return fetch('https://spee.ch/api/claim/publish', {
    method: 'POST',
    body: data,
  })
    .then(response => response.json())
    .then(
      json =>
        json.success
          ? dispatch({
              type: ACTIONS.UPDATE_PUBLISH_FORM,
              data: {
                uploadThumbnailStatus: THUMBNAIL_STATUSES.COMPLETE,
                thumbnail: `${json.data.url}${fileExt}`,
              },
            })
          : uploadError(json.message)
    )
    .catch(err => uploadError(err.message));
};

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
    licenseType: license,
    licenseUrl,
    nsfw,
    thumbnail,
    title,
    uri,
    uploadThumbnailStatus: thumbnail ? THUMBNAIL_STATUSES.MANUAL : undefined,
  };

  dispatch({ type: ACTIONS.DO_PREPARE_EDIT, data: publishData });
};

export const doPublish = (params: PublishParams) => (dispatch: Dispatch, getState: () => {}) => {
  const state = getState();
  const myChannels = selectMyChannelClaims(state);

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
    title,
    contentIsFree,
    price,
    uri,
    sources,
  } = params;

  // get the claim id from the channel name, we will use that instead
  const namedChannelClaim = myChannels.find(myChannel => myChannel.name === channel);
  const channelId = namedChannelClaim ? namedChannelClaim.claim_id : '';
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
      data: { pendingPublish: { ...publishPayload } },
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

  let publishCheckInterval;

  const checkFileList = () => {
    Lbry.claim_list_mine().then(claims => {
      const pendingPublishMap = {};
      pendingPublishes.forEach(({ name }) => {
        pendingPublishMap[name] = name;
      });

      const actions = [];
      claims.forEach(claim => {
        if (pendingPublishMap[claim.name]) {
          actions.push({
            type: ACTIONS.REMOVE_PENDING_PUBLISH,
            data: {
              name: claim.name,
            },
          });

          delete pendingPublishMap[claim.name];
          if (selectosNotificationsEnabled(getState())) {
            const notif = new window.Notification('LBRY Publish Complete', {
              body: `${claim.value.stream.metadata.title} has been published to lbry://${
                claim.name
              }. Click here to view it`,
              silent: false,
            });
            notif.onclick = () => {
              dispatch(
                doNavigate('/show', {
                  uri: claim.permanent_url,
                })
              );
            };
          }
        }
      });

      actions.push({
        type: ACTIONS.FETCH_CLAIM_LIST_MINE_COMPLETED,
        data: {
          claims,
        },
      });

      dispatch(batchActions(...actions));

      if (!Object.keys(pendingPublishMap).length) {
        clearInterval(publishCheckInterval);
      }
    });
  };

  if (pendingPublishes.length) {
    checkFileList();
    publishCheckInterval = setInterval(() => {
      checkFileList();
    }, 30000);
  }
};
