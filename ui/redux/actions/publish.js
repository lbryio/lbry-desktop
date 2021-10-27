// @flow
import * as MODALS from 'constants/modal_types';
import * as ACTIONS from 'constants/action_types';
import * as PAGES from 'constants/pages';
import { batchActions } from 'util/batch-actions';
import { doCheckPendingClaims } from 'redux/actions/claims';
import {
  makeSelectClaimForUri,
  selectMyActiveClaims,
  selectMyClaims,
  selectMyChannelClaims,
  // selectMyClaimsWithoutChannels,
  selectReflectingById,
} from 'redux/selectors/claims';
import { makeSelectPublishFormValue, selectPublishFormValues, selectMyClaimForUri } from 'redux/selectors/publish';
import { doError } from 'redux/actions/notifications';
import { push } from 'connected-react-router';
import analytics from 'analytics';
import { doOpenModal } from 'redux/actions/app';
import { CC_LICENSES, COPYRIGHT, OTHER, NONE, PUBLIC_DOMAIN } from 'constants/licenses';
import { SPEECH_STATUS, SPEECH_PUBLISH } from 'constants/speech_urls';
import * as THUMBNAIL_STATUSES from 'constants/thumbnail_upload_statuses';
import { creditsToString } from 'util/format-credits';
import Lbry from 'lbry';
// import LbryFirst from 'extras/lbry-first/lbry-first';
import { isClaimNsfw } from 'util/claim';

function resolveClaimTypeForAnalytics(claim) {
  if (!claim) {
    return 'undefined_claim';
  }

  switch (claim.value_type) {
    case 'stream':
      if (claim.value) {
        if (!claim.value.source) {
          return 'livestream';
        } else {
          return claim.value.stream_type;
        }
      } else {
        return 'stream';
      }
    default:
      // collection, channel, repost, undefined
      return claim.value_type;
  }
}

export const NO_FILE = '---';

function resolvePublishPayload(publishData, myClaimForUri, myChannels, preview) {
  const {
    name,
    bid,
    filePath,
    description,
    language,
    releaseTimeEdited,
    // license,
    licenseUrl,
    useLBRYUploader,
    licenseType,
    otherLicenseDescription,
    thumbnail,
    channel,
    title,
    contentIsFree,
    fee,
    // uri,
    tags,
    // locations,
    optimize,
    isLivestreamPublish,
    remoteFileUrl,
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
  const namedChannelClaim = myChannels ? myChannels.find((myChannel) => myChannel.name === channel) : null;
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
    preview?: boolean,
    remote_url?: string,
  } = {
    name,
    title,
    description,
    locations: [],
    bid: creditsToString(bid),
    languages: [language],
    tags: tags && tags.map((tag) => tag.name),
    thumbnail_url: thumbnail,
    blocking: true,
    preview: false,
  };

  // Temporary solution to keep the same publish flow with the new tags api
  // Eventually we will allow users to enter their own tags on publish
  // `nsfw` will probably be removed
  if (remoteFileUrl) {
    publishPayload.remote_url = remoteFileUrl;
  }

  if (publishingLicense) {
    publishPayload.license = publishingLicense;
  }

  if (licenseUrl) {
    publishPayload.license_url = licenseUrl;
  }

  if (thumbnail) {
    publishPayload.thumbnail_url = thumbnail;
  }

  if (useLBRYUploader) {
    publishPayload.tags.push('lbry-first');
  }

  // Set release time to curret date. On edits, keep original release/transaction time as release_time
  if (releaseTimeEdited) {
    publishPayload.release_time = releaseTimeEdited;
  } else if (myClaimForUriEditing && myClaimForUriEditing.value.release_time) {
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

  if (!contentIsFree && fee && fee.currency && Number(fee.amount) > 0) {
    publishPayload.fee_currency = fee.currency;
    publishPayload.fee_amount = creditsToString(fee.amount);
  }

  if (optimize) {
    publishPayload.optimize_file = true;
  }

  // Only pass file on new uploads, not metadata only edits.
  // The sdk will figure it out
  if (filePath && !isLivestreamPublish) {
    publishPayload.file_path = filePath;
  }

  if (preview) {
    publishPayload.preview = true;
    publishPayload.optimize_file = false;
  }

  return publishPayload;
}

export const doPublishDesktop = (filePath: string, preview?: boolean) => (dispatch: Dispatch, getState: () => {}) => {
  const publishPreview = (previewResponse) => {
    dispatch(
      doOpenModal(MODALS.PUBLISH_PREVIEW, {
        previewResponse,
      })
    );
  };

  const noFileParam = !filePath || filePath === NO_FILE;
  const state = getState();
  const editingUri = makeSelectPublishFormValue('editingURI')(state) || '';
  const remoteUrl = makeSelectPublishFormValue('remoteFileUrl')(state);
  const claim = makeSelectClaimForUri(editingUri)(state) || {};
  const hasSourceFile = claim.value && claim.value.source;
  const redirectToLivestream = noFileParam && !hasSourceFile && !remoteUrl;

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
      data: {
        type: resolveClaimTypeForAnalytics(pendingClaim),
      },
    });

    // We have to fake a temp claim until the new pending one is returned by claim_list_mine
    // We can't rely on claim_list_mine because there might be some delay before the new claims are returned
    // Doing this allows us to show the pending claim immediately, it will get overwritten by the real one
    const isMatch = (claim) => claim.claim_id === pendingClaim.claim_id;
    const isEdit = myClaims.some(isMatch);

    actions.push({
      type: ACTIONS.UPDATE_PENDING_CLAIMS,
      data: {
        claims: [pendingClaim],
      },
    });
    // @if TARGET='app'
    actions.push({
      type: ACTIONS.ADD_FILES_REFLECTING,
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
    // @if TARGET='web'
    if (redirectToLivestream) {
      dispatch(push(`/$/${PAGES.LIVESTREAM}`));
    }
    // @endif
  };

  const publishFail = (error) => {
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
  if (!redirectToLivestream) {
    dispatch(push(`/$/${PAGES.UPLOADS}`));
  }
  // @endif

  dispatch(doPublish(publishSuccess, publishFail));
};

export const doPublishResume = (publishPayload: any) => (dispatch: Dispatch, getState: () => {}) => {
  const publishSuccess = (successResponse, lbryFirstError) => {
    const state = getState();
    const myClaimIds: Set<string> = selectMyActiveClaims(state);

    const pendingClaim = successResponse.outputs[0];
    const { permanent_url: url } = pendingClaim;

    analytics.apiLogPublish(pendingClaim);

    // We have to fake a temp claim until the new pending one is returned by claim_list_mine
    // We can't rely on claim_list_mine because there might be some delay before the new claims are returned
    // Doing this allows us to show the pending claim immediately, it will get overwritten by the real one
    const isEdit = myClaimIds.has(pendingClaim.claim_id);

    const actions = [];

    actions.push({
      type: ACTIONS.PUBLISH_SUCCESS,
      data: {
        type: resolveClaimTypeForAnalytics(pendingClaim),
      },
    });

    actions.push({
      type: ACTIONS.UPDATE_PENDING_CLAIMS,
      data: {
        claims: [pendingClaim],
      },
    });

    dispatch(batchActions(...actions));

    dispatch(
      doOpenModal(MODALS.PUBLISH, {
        uri: url,
        isEdit,
        lbryFirstError,
      })
    );

    dispatch(doCheckPendingClaims());
  };

  const publishFail = (error) => {
    const actions = [];
    actions.push({
      type: ACTIONS.PUBLISH_FAIL,
    });
    actions.push(doError(error.message));
    dispatch(batchActions(...actions));
  };

  dispatch(doPublish(publishSuccess, publishFail, false, publishPayload));
};

export const doResetThumbnailStatus = () => (dispatch: Dispatch) => {
  dispatch({
    type: ACTIONS.UPDATE_PUBLISH_FORM,
    data: {
      thumbnailPath: '',
      thumbnailError: undefined,
    },
  });

  return fetch(SPEECH_STATUS)
    .then((res) => res.json())
    .then((status) => {
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

export const doUpdatePublishForm = (publishFormValue: UpdatePublishFormData) => (dispatch: Dispatch) =>
  dispatch({
    type: ACTIONS.UPDATE_PUBLISH_FORM,
    data: { ...publishFormValue },
  });

export const doUploadThumbnail = (
  filePath?: string,
  thumbnailBlob?: File,
  fsAdapter?: any,
  fs?: any,
  path?: any,
  cb?: (string) => void
) => (dispatch: Dispatch) => {
  const downMessage = __('Thumbnail upload service may be down, try again later.');
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

  dispatch({
    type: ACTIONS.UPDATE_PUBLISH_FORM,
    data: {
      thumbnailError: undefined,
    },
  });

  const doUpload = (data) => {
    return fetch(SPEECH_PUBLISH, {
      method: 'POST',
      body: data,
    })
      .then((res) => res.text())
      .then((text) => (text.length ? JSON.parse(text) : {}))
      .then((json) => {
        if (!json.success) return uploadError(json.message || downMessage);
        if (cb) {
          cb(json.data.serveUrl);
        }
        return dispatch({
          type: ACTIONS.UPDATE_PUBLISH_FORM,
          data: {
            uploadThumbnailStatus: THUMBNAIL_STATUSES.COMPLETE,
            thumbnail: json.data.serveUrl,
          },
        });
      })
      .catch((err) => {
        let message = err.message;

        // This sucks but ¯\_(ツ)_/¯
        if (message === 'Failed to fetch') {
          message = downMessage;
        }

        uploadError(message);
      });
  };

  dispatch({
    type: ACTIONS.UPDATE_PUBLISH_FORM,
    data: { uploadThumbnailStatus: THUMBNAIL_STATUSES.IN_PROGRESS },
  });

  if (fsAdapter && fsAdapter.readFile && filePath) {
    fsAdapter.readFile(filePath, 'base64').then((base64Image) => {
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
    const file = thumbnailBlob || (thumbnail && new File([thumbnail], fileName, { type: fileType }));
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
    release_time,
    license,
    license_url: licenseUrl,
    thumbnail,
    title,
    tags,
  } = value;

  const publishData: UpdatePublishFormData = {
    name,
    bid: Number(amount),
    contentIsFree: fee.amount === '0',
    author,
    description,
    fee,
    languages,
    releaseTime: release_time,
    releaseTimeEdited: undefined,
    thumbnail: thumbnail ? thumbnail.url : null,
    title,
    uri,
    uploadThumbnailStatus: thumbnail ? THUMBNAIL_STATUSES.MANUAL : undefined,
    licenseUrl,
    nsfw: isClaimNsfw(claim),
    tags: tags ? tags.map((tag) => ({ name: tag })) : [],
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

export const doPublish = (success: Function, fail: Function, preview: Function, payload: any) => (
  dispatch: Dispatch,
  getState: () => {}
) => {
  if (!preview) {
    dispatch({ type: ACTIONS.PUBLISH_START });
  }

  const state = getState();
  const myClaimForUri = selectMyClaimForUri(state);
  const myChannels = selectMyChannelClaims(state);
  // const myClaims = selectMyClaimsWithoutChannels(state);
  // get redux publish form
  const publishData = selectPublishFormValues(state);

  const publishPayload = payload || resolvePublishPayload(publishData, myClaimForUri, myChannels, preview);

  if (preview) {
    return Lbry.publish(publishPayload).then((previewResponse: PublishResponse) => {
      return preview(previewResponse);
    }, fail);
  }

  return Lbry.publish(publishPayload).then((response: PublishResponse) => {
    // TODO: Restore LbryFirst
    // if (!useLBRYUploader) {
    return success(response);
    // }

    // $FlowFixMe
    // publishPayload.permanent_url = response.outputs[0].permanent_url;
    //
    // return LbryFirst.upload(publishPayload)
    //   .then(() => {
    //     // Return original publish response so app treats it like a normal publish
    //     return success(response);
    //   })
    //   .catch((error) => {
    //     return success(response, error);
    //   });
  }, fail);
};

// Calls file_list until any reflecting files are done
export const doCheckReflectingFiles = () => (dispatch: Dispatch, getState: GetState) => {
  const state = getState();
  const { checkingReflector } = state.claims;
  let reflectorCheckInterval;

  const checkFileList = async () => {
    const state = getState();
    const reflectingById = selectReflectingById(state);
    const ids = Object.keys(reflectingById);

    const newReflectingById = {};
    const promises = [];
    // TODO: just use file_list({claim_id: Array<claimId>})
    if (Object.keys(reflectingById).length) {
      ids.forEach((claimId) => {
        promises.push(Lbry.file_list({ claim_id: claimId }));
      });

      Promise.all(promises)
        .then((results) => {
          results.forEach((res) => {
            if (res.items[0]) {
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
