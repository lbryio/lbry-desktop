// @flow
import { CC_LICENSES, COPYRIGHT, OTHER, NONE, PUBLIC_DOMAIN } from 'constants/licenses';
import { SPEECH_STATUS, SPEECH_PUBLISH } from 'constants/speech_urls';
import * as ACTIONS from 'constants/action_types';
import * as THUMBNAIL_STATUSES from 'constants/thumbnail_upload_statuses';
import Lbry from 'lbry';
import { batchActions } from 'util/batch-actions';
import { creditsToString } from 'util/format-credits';
import { doError } from 'redux/actions/notifications';
import { isClaimNsfw } from 'util/claim';
import {
  selectMyChannelClaims,
  selectPendingById,
  selectMyClaimsWithoutChannels,
  selectReflectingById,
} from 'redux/selectors/claims';
import { selectPublishFormValues, selectMyClaimForUri } from 'redux/selectors/publish';

export const doResetThumbnailStatus = () => (dispatch: Dispatch) => {
  dispatch({
    type: ACTIONS.UPDATE_PUBLISH_FORM,
    data: {
      thumbnailPath: '',
    },
  });

  return fetch(SPEECH_STATUS)
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
        },
      });
    })
    .catch(() =>
      dispatch({
        type: ACTIONS.UPDATE_PUBLISH_FORM,
        data: {
          uploadThumbnailStatus: THUMBNAIL_STATUSES.API_DOWN,
          thumbnail: '',
        },
      })
    );
};

export const doClearPublish = () => (dispatch: Dispatch) => {
  dispatch({ type: ACTIONS.CLEAR_PUBLISH });
  return dispatch(doResetThumbnailStatus());
};

export const doUpdatePublishForm = (publishFormValue: UpdatePublishFormData) => (
  dispatch: Dispatch
) =>
  dispatch({
    type: ACTIONS.UPDATE_PUBLISH_FORM,
    data: { ...publishFormValue },
  });

export const doUploadThumbnail = (
  filePath?: string,
  thumbnailBlob?: File,
  fsAdapter?: any,
  fs?: any,
  path?: any
) => (dispatch: Dispatch) => {
  let thumbnail, fileExt, fileName, fileType;

  const makeid = () => {
    let text = '';
    const possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    for (let i = 0; i < 24; i += 1) text += possible.charAt(Math.floor(Math.random() * 62));
    return text;
  };

  const uploadError = (error = '') => {
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
  };

  const doUpload = data => {
    return fetch(SPEECH_PUBLISH, {
      method: 'POST',
      body: data,
    })
      .then(res => res.text())
      .then(text => (text.length ? JSON.parse(text) : {}))
      .then(json => {
        return json.success
          ? dispatch({
            type: ACTIONS.UPDATE_PUBLISH_FORM,
            data: {
              uploadThumbnailStatus: THUMBNAIL_STATUSES.COMPLETE,
              thumbnail: json.data.serveUrl,
            },
          })
          : uploadError(
            json.message || __('Thumbnail upload service may be down, try again later.')
          );
      })
      .catch(err => {
        uploadError(err.message);
      });
  };

  dispatch({
    type: ACTIONS.UPDATE_PUBLISH_FORM,
    data: { uploadThumbnailStatus: THUMBNAIL_STATUSES.IN_PROGRESS },
  });

  if (fsAdapter && fsAdapter.readFile && filePath) {
    fsAdapter.readFile(filePath, 'base64').then(base64Image => {
      fileExt = 'png';
      fileName = 'thumbnail.png';
      fileType = 'image/png';

      const data = new FormData();
      const name = makeid();
      data.append('name', name);
      // $FlowFixMe
      data.append('file', { uri: 'file://' + filePath, type: fileType, name: fileName });
      return doUpload(data);
    });
  } else {
    if (filePath && fs && path) {
      thumbnail = fs.readFileSync(filePath);
      fileExt = path.extname(filePath);
      fileName = path.basename(filePath);
      fileType = `image/${fileExt.slice(1)}`;
    } else if (thumbnailBlob) {
      fileExt = `.${thumbnailBlob.type && thumbnailBlob.type.split('/')[1]}`;
      fileName = thumbnailBlob.name;
      fileType = thumbnailBlob.type;
    } else {
      return null;
    }

    const data = new FormData();
    const name = makeid();
    const file =
      thumbnailBlob || (thumbnail && new File([thumbnail], fileName, { type: fileType }));
    data.append('name', name);
    // $FlowFixMe
    data.append('file', file);
    return doUpload(data);
  }
};

export const doPrepareEdit = (claim: StreamClaim, uri: string, fileInfo: FileListItem, fs: any) => (
  dispatch: Dispatch
) => {
  const { name, amount, value = {} } = claim;
  const channelName = (claim && claim.signing_channel && claim.signing_channel.name) || null;
  const {
    author,
    description,
    // use same values as default state
    // fee will be undefined for free content
    fee = {
      amount: '0',
      currency: 'LBC',
    },
    languages,
    license,
    license_url: licenseUrl,
    thumbnail,
    title,
    tags,
  } = value;

  const publishData: UpdatePublishFormData = {
    name,
    bid: amount,
    contentIsFree: fee.amount === '0',
    author,
    description,
    fee,
    languages,
    thumbnail: thumbnail ? thumbnail.url : null,
    title,
    uri,
    uploadThumbnailStatus: thumbnail ? THUMBNAIL_STATUSES.MANUAL : undefined,
    licenseUrl,
    nsfw: isClaimNsfw(claim),
    tags: tags ? tags.map(tag => ({ name: tag })) : [],
  };

  // Make sure custom licenses are mapped properly
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
  if (channelName) {
    publishData['channel'] = channelName;
  }

  dispatch({ type: ACTIONS.DO_PREPARE_EDIT, data: publishData });
};

export const doPublish = (success: Function, fail: Function) => (
  dispatch: Dispatch,
  getState: () => {}
) => {
  dispatch({ type: ACTIONS.PUBLISH_START });

  const state = getState();
  const myClaimForUri = selectMyClaimForUri(state);
  const myChannels = selectMyChannelClaims(state);
  const myClaims = selectMyClaimsWithoutChannels(state);
  // get redux publish form
  const publishData = selectPublishFormValues(state);

  // destructure the data values
  const {
    name,
    bid,
    filePath,
    description,
    language,
    license,
    licenseUrl,
    licenseType,
    otherLicenseDescription,
    thumbnail,
    channel,
    title,
    contentIsFree,
    fee,
    uri,
    tags,
    locations,
    optimize,
  } = publishData;
  // Handle scenario where we have a claim that has the same name as a channel we are publishing with.
  const myClaimForUriEditing = myClaimForUri && myClaimForUri.name === name ? myClaimForUri : null;

  let publishingLicense;
  switch (licenseType) {
    case COPYRIGHT:
    case OTHER:
      publishingLicense = otherLicenseDescription;
      break;
    default:
      publishingLicense = licenseType;
  }

  // get the claim id from the channel name, we will use that instead
  const namedChannelClaim = myChannels
    ? myChannels.find(myChannel => myChannel.name === channel)
    : null;
  const channelId = namedChannelClaim ? namedChannelClaim.claim_id : '';

  const publishPayload: {
    name: ?string,
    bid: string,
    description?: string,
    channel_id?: string,
    file_path?: string,

    license_url?: string,
    license?: string,
    thumbnail_url?: string,
    release_time?: number,
    fee_currency?: string,
    fee_amount?: string,
    languages?: Array<string>,
    tags: Array<string>,
    locations?: Array<any>,
    blocking: boolean,
    optimize_file?: boolean,
  } = {
    name,
    title,
    description,
    locations: [],
    bid: creditsToString(bid),
    languages: [language],
    tags: tags && tags.map(tag => tag.name),
    thumbnail_url: thumbnail,
    blocking: true,
  };
  // Temporary solution to keep the same publish flow with the new tags api
  // Eventually we will allow users to enter their own tags on publish
  // `nsfw` will probably be removed

  if (publishingLicense) {
    publishPayload.license = publishingLicense;
  }

  if (licenseUrl) {
    publishPayload.license_url = licenseUrl;
  }

  if (thumbnail) {
    publishPayload.thumbnail_url = thumbnail;
  }

  // Set release time to curret date. On edits, keep original release/transaction time as release_time
  if (myClaimForUriEditing && myClaimForUriEditing.value.release_time) {
    publishPayload.release_time = Number(myClaimForUri.value.release_time);
  } else if (myClaimForUriEditing && myClaimForUriEditing.timestamp) {
    publishPayload.release_time = Number(myClaimForUriEditing.timestamp);
  } else {
    publishPayload.release_time = Number(Math.round(Date.now() / 1000));
  }

  if (channelId) {
    publishPayload.channel_id = channelId;
  }

  if (myClaimForUriEditing && myClaimForUriEditing.value && myClaimForUriEditing.value.locations) {
    publishPayload.locations = myClaimForUriEditing.value.locations;
  }

  if (!contentIsFree && fee && (fee.currency && Number(fee.amount) > 0)) {
    publishPayload.fee_currency = fee.currency;
    publishPayload.fee_amount = creditsToString(fee.amount);
  }

  if (optimize) {
    publishPayload.optimize_file = true;
  }

  // Only pass file on new uploads, not metadata only edits.
  // The sdk will figure it out
  if (filePath) publishPayload.file_path = filePath;

  return Lbry.publish(publishPayload).then(success, fail);
};

// Calls file_list until any reflecting files are done
export const doCheckReflectingFiles = () => (dispatch: Dispatch, getState: GetState) => {
  const state = getState();
  const { checkingReflector } = state.claims;
  let reflectorCheckInterval;

  const checkFileList = async() => {
    const state = getState();
    const reflectingById = selectReflectingById(state);
    const ids = Object.keys(reflectingById);

    const newReflectingById = {};
    const promises = [];
    // TODO: just use file_list({claim_id: Array<claimId>})
    if (Object.keys(reflectingById).length) {
      ids.forEach(claimId => {
        promises.push(Lbry.file_list({ claim_id: claimId }));
      });

      Promise.all(promises)
        .then(results => {
          results.forEach(res => {
            const fileListItem = res.items[0];
            const fileClaimId = fileListItem.claim_id;
            const {
              is_fully_reflected: done,
              uploading_to_reflector: uploading,
              reflector_progress: progress,
            } = fileListItem;
            if (uploading) {
              newReflectingById[fileClaimId] = {
                fileListItem: fileListItem,
                progress,
                stalled: !done && !uploading,
              };
            }
          });
        })
        .then(() => {
          dispatch({
            type: ACTIONS.UPDATE_FILES_REFLECTING,
            data: newReflectingById,
          });
          if (!Object.keys(newReflectingById).length) {
            dispatch({
              type: ACTIONS.TOGGLE_CHECKING_REFLECTING,
              data: false,
            });
            clearInterval(reflectorCheckInterval);
          }
        });
    } else {
      dispatch({
        type: ACTIONS.TOGGLE_CHECKING_REFLECTING,
        data: false,
      });
      clearInterval(reflectorCheckInterval);
    }
  };
  // do it once...
  checkFileList();
  // then start the interval if it's not already started
  if (!checkingReflector) {
    dispatch({
      type: ACTIONS.TOGGLE_CHECKING_REFLECTING,
      data: true,
    });
    reflectorCheckInterval = setInterval(() => {
      checkFileList();
    }, 5000);
  }
};
export const doCheckPendingPublishes = (onConfirmed: Function) => (
  dispatch: Dispatch,
  getState: GetState
) => {
  let publishCheckInterval;

  const checkFileList = () => {
    const state = getState();
    const pendingById = selectPendingById(state);
    Lbry.claim_list({ page: 1, page_size: 10 })
      .then(result => {
        const claims = result.items;
        const claimsToConfirm = [];
        claims.forEach(claim => {
          if (claim.confirmations > 0 && pendingById[claim.claim_id]) {
            delete pendingById[claim.claim_id];
            claimsToConfirm.push(claim);
            if (onConfirmed) {
              onConfirmed(claim);
            }
          }
        });
        if (claimsToConfirm.length) {
          dispatch({
            type: ACTIONS.UPDATE_CONFIRMED_CLAIMS,
            data: {
              claims: claimsToConfirm,
            },
          });
        }
        return Object.keys(pendingById).length;
      })
      .then(len => {
        if (!len) {
          clearInterval(publishCheckInterval);
        }
      });
  };

  publishCheckInterval = setInterval(() => {
    checkFileList();
  }, 30000);
};
