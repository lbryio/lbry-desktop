// @flow
import type { Dispatch, GetState } from 'types/redux';
import type { Metadata } from 'types/claim';
import type {
  UpdatePublishFormData,
  UpdatePublishFormAction,
  PublishParams,
} from 'redux/reducers/publish';
import { CC_LICENSES, COPYRIGHT, OTHER, NONE, PUBLIC_DOMAIN } from 'constants/licenses';
import * as MODALS from 'constants/modal_types';
import {
  ACTIONS,
  Lbry,
  selectMyChannelClaims,
  THUMBNAIL_STATUSES,
  batchActions,
  creditsToString,
  selectPendingById,
  selectMyClaimsWithoutChannels,
  doError,
} from 'lbry-redux';
import { doOpenModal } from 'redux/actions/app';
import { selectosNotificationsEnabled } from 'redux/selectors/settings';
import { push } from 'connected-react-router';
import analytics from 'analytics';
import { formatLbryUriForWeb } from 'util/uri';
// @if TARGET='app'
import fs from 'fs';
import path from 'path';
// @endif

type Action = UpdatePublishFormAction | { type: ACTIONS.CLEAR_PUBLISH };

export const doResetThumbnailStatus = () => (dispatch: Dispatch): Promise<Action> => {
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

export const doClearPublish = () => (dispatch: Dispatch): Promise<Action> => {
  dispatch({ type: ACTIONS.CLEAR_PUBLISH });
  return dispatch(doResetThumbnailStatus());
};

export const doUpdatePublishForm = (publishFormValue: UpdatePublishFormData) => (
  dispatch: Dispatch
): UpdatePublishFormAction =>
  dispatch(
    ({
      type: ACTIONS.UPDATE_PUBLISH_FORM,
      data: { ...publishFormValue },
    }: UpdatePublishFormAction)
  );

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
          data: {
            uploadThumbnailStatus: THUMBNAIL_STATUSES.READY,
            thumbnail: '',
            nsfw: false,
          },
        },
        doError(error)
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
    .then(json =>
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

  const publishData: UpdatePublishFormData = {
    name,
    channel: channelName,
    bid: amount,
    price: { amount: fee.amount, currency: fee.currency },
    contentIsFree: !fee.amount,
    author,
    description,
    fee,
    language,
    nsfw,
    thumbnail,
    title,
    uri,
    uploadThumbnailStatus: thumbnail ? THUMBNAIL_STATUSES.MANUAL : undefined,
    licenseUrl,
  };

  // Make sure custom liscence's are mapped properly
  // If the license isn't one of the standard licenses, map the custom license and description/url
  if (!CC_LICENSES.some(({ value }) => value === license)) {
    if (!license || license === NONE || license === PUBLIC_DOMAIN) {
      publishData.licenseType = license;
    } else if (license && !licenseUrl && license !== NONE) {
      publishData.licenseType = COPYRIGHT;
    } else {
      publishData.licenseType = OTHER;
    }

    publishData.otherLicenseDescription = license;
  } else {
    publishData.licenseType = license;
  }

  dispatch({ type: ACTIONS.DO_PREPARE_EDIT, data: publishData });
};

export const doPublish = (params: PublishParams) => (dispatch: Dispatch, getState: () => {}) => {
  const state = getState();
  const myChannels = selectMyChannelClaims(state);
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
    title,
    contentIsFree,
    price,
    uri,
  } = params;

  // get the claim id from the channel name, we will use that instead
  const namedChannelClaim = myChannels.find(myChannel => myChannel.name === channel);
  const channelId = namedChannelClaim ? namedChannelClaim.claim_id : '';
  const fee = contentIsFree || !price.amount ? undefined : { ...price };

  const metadata: Metadata = {
    title,
    nsfw,
    license,
    licenseUrl,
    language,
    thumbnail,
    description: description || undefined,
  };

  const publishPayload: {
    name: ?string,
    channel_id: string,
    bid: ?number,
    metadata: ?Metadata,
    file_path?: string,
  } = {
    name,
    channel_id: channelId,
    bid: creditsToString(bid),
    metadata,
  };

  if (fee) {
    metadata.fee = {
      currency: fee.currency,
      amount: creditsToString(fee.amount),
    };
  }
  // only pass file on new uploads, not metadata only edits.
  if (filePath) publishPayload.file_path = filePath;

  dispatch({ type: ACTIONS.PUBLISH_START });

  const success = pendingClaim => {
    analytics.apiLogPublish();
    const actions = [];

    actions.push({
      type: ACTIONS.PUBLISH_SUCCESS,
    });

    actions.push(doOpenModal(MODALS.PUBLISH, { uri }));

    // We have to fake a temp claim until the new pending one is returned by claim_list_mine
    // We can't rely on claim_list_mine because there might be some delay before the new claims are returned
    // Doing this allows us to show the pending claim immediately, it will get overwritten by the real one
    const isMatch = claim => claim.claim_id === pendingClaim.claim_id;
    const isEdit = myClaims.some(isMatch);
    const myNewClaims = isEdit
      ? myClaims.map(claim => (isMatch(claim) ? pendingClaim.output : claim))
      : myClaims.concat(pendingClaim.output);

    actions.push({
      type: ACTIONS.FETCH_CLAIM_LIST_MINE_COMPLETED,
      data: {
        claims: myNewClaims,
      },
    });

    dispatch(batchActions(...actions));
  };

  const failure = error => {
    dispatch({ type: ACTIONS.PUBLISH_FAIL });
    dispatch(doError(error.message));
  };

  return Lbry.publish(publishPayload).then(success, failure);
};

// Calls claim_list_mine until any pending publishes are confirmed
export const doCheckPendingPublishes = () => (dispatch: Dispatch, getState: GetState) => {
  const state = getState();
  const pendingById = selectPendingById(state);

  if (!Object.keys(pendingById).length) {
    return;
  }

  let publishCheckInterval;

  const checkFileList = () => {
    Lbry.claim_list_mine().then(claims => {
      claims.forEach(claim => {
        // If it's confirmed, check if it was pending previously
        if (claim.confirmations > 0 && pendingById[claim.claim_id]) {
          delete pendingById[claim.claim_id];

          // If it's confirmed, check if we should notify the user
          if (selectosNotificationsEnabled(getState())) {
            const notif = new window.Notification('LBRY Publish Complete', {
              body: `${claim.value.stream.metadata.title} has been published to lbry://${
                claim.name
              }. Click here to view it`,
              silent: false,
            });
            notif.onclick = () => {
              dispatch(push(formatLbryUriForWeb(claim.permanent_url)));
            };
          }
        }
      });

      dispatch({
        type: ACTIONS.FETCH_CLAIM_LIST_MINE_COMPLETED,
        data: {
          claims,
        },
      });

      if (!Object.keys(pendingById).length) {
        clearInterval(publishCheckInterval);
      }
    });
  };

  publishCheckInterval = setInterval(() => {
    checkFileList();
  }, 30000);
};
