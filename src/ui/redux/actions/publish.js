// @flow
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
  isClaimNsfw,
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

export const doResetThumbnailStatus = () => (dispatch: Dispatch) => {
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

export const doClearPublish = () => (dispatch: Dispatch) => {
  dispatch({ type: ACTIONS.CLEAR_PUBLISH });
  return dispatch(doResetThumbnailStatus());
};

export const doUpdatePublishForm = (publishFormValue: UpdatePublishFormData) => (dispatch: Dispatch) =>
  dispatch({
    type: ACTIONS.UPDATE_PUBLISH_FORM,
    data: { ...publishFormValue },
  });

export const doUploadThumbnail = (filePath: string) => (dispatch: Dispatch) => {
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

export const doPrepareEdit = (claim: StreamClaim, uri: string) => (dispatch: Dispatch) => {
  const { name, amount, channel_name: channelName, value } = claim;

  const {
    author,
    description,
    // use same values as default state
    // fee will be undefined for free content
    fee = {
      amount: 0,
      currency: 'LBC',
    },
    languages,
    license,
    license_url: licenseUrl,
    thumbnail,
    title,
  } = value;

  const publishData: UpdatePublishFormData = {
    name,
    channel: channelName,
    bid: amount,
    contentIsFree: !fee.amount,
    author,
    description,
    fee: { amount: fee.amount, currency: fee.currency },
    languages,
    thumbnail: thumbnail ? thumbnail.url : null,
    title,
    uri,
    uploadThumbnailStatus: thumbnail ? THUMBNAIL_STATUSES.MANUAL : undefined,
    licenseUrl,
  };

  if (claim && isClaimNsfw(claim)) {
    publishData.nsfw = true;
  } else {
    publishData.nsfw = false;
  }

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
  dispatch({ type: ACTIONS.PUBLISH_START });

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
    channel,
    title,
    contentIsFree,
    feeAmount,
    feeCurrency,
    uri,
    nsfw,
    claim,
  } = params;

  // get the claim id from the channel name, we will use that instead
  const namedChannelClaim = myChannels.find(myChannel => myChannel.name === channel);
  const channelId = namedChannelClaim ? namedChannelClaim.claim_id : '';

  const publishPayload: {
    name: ?string,
    channel_id?: string,
    bid: number,
    file_path?: string,
    tags: Array<string>,
    locations?: Array<Location>,
    license_url: string,
    thumbnail_url: string,
    release_time: number,
  } = {
    name,
    bid: creditsToString(bid),
    title,
    license,
    languages: [language],
    description,
    tags: claim.value.tags,
    locations: claim.value.locations,
  };

  // Temporary solution to keep the same publish flow with the new tags api
  // Eventually we will allow users to enter their own tags on publish
  // `nsfw` will probably be removed

  if (licenseUrl) {
    publishPayload.license_url = licenseUrl;
  }

  if (thumbnail) {
    publishPayload.thumbnail_url = thumbnail;
  }

  if (claim.value.release_time) {
    publishPayload.release_time = Number(claim.value.release_time);
  }

  if (nsfw) {
    if (!publishPayload.tags.includes('mature')) {
      publishPayload.tags.push('mature');
    }
  } else {
    const remove = publishPayload.tags.indexOf('mature');
    if (remove > -1) {
      publishPayload.tags.splice(remove, 1);
    }
  }

  if (channelId) {
    publishPayload.channel_id = channelId;
  }

  if (!contentIsFree && (feeCurrency && Number(feeAmount) > 0)) {
    publishPayload.fee_currency = feeCurrency;
    publishPayload.fee_amount = creditsToString(feeAmount);
  }

  // Only pass file on new uploads, not metadata only edits.
  // The sdk will figure it out
  if (filePath) publishPayload.file_path = filePath;

  const success = successResponse => {
    analytics.apiLogPublish();

    const pendingClaim = successResponse.outputs[0];
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
      ? myClaims.map(claim => (isMatch(claim) ? pendingClaim : claim))
      : myClaims.concat(pendingClaim);

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
    Lbry.claim_list().then(claims => {
      claims.forEach(claim => {
        // If it's confirmed, check if it was pending previously
        if (claim.confirmations > 0 && pendingById[claim.claim_id]) {
          delete pendingById[claim.claim_id];

          // If it's confirmed, check if we should notify the user
          if (selectosNotificationsEnabled(getState())) {
            const notif = new window.Notification('LBRY Publish Complete', {
              body: `${claim.value.title} has been published to lbry://${claim.name}. Click here to view it`,
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
