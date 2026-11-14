import * as MODALS from "constants/modal_types";
import * as ACTIONS from "constants/action_types";
import * as PAGES from "constants/pages";
import { batchActions } from "util/batch-actions";
import { doCheckPendingClaims } from "redux/actions/claims";
import { selectMyClaims, selectMyChannelClaims, selectReflectingById } from "redux/selectors/claims";
import { selectPublishFormValues, selectMyClaimForUri } from "redux/selectors/publish";
import { doError } from "redux/actions/notifications";
import { push } from "connected-react-router";
import analytics from "analytics";
import { doOpenModal } from "redux/actions/app";
import { CC_LICENSES, COPYRIGHT, OTHER, NONE, PUBLIC_DOMAIN } from "constants/licenses";
import { uploadImage } from "util/upload-image";
import * as THUMBNAIL_STATUSES from "constants/thumbnail_upload_statuses";
import { creditsToString } from "util/format-credits";
import Lbry from "lbry";
import { isClaimNsfw } from "util/claim";

export const NO_FILE = "---";
export const doPublishDesktop =
  (filePath?: File | null, preview?: boolean) => (dispatch: Dispatch, getState: () => Record<any, any>) => {
    const publishPreview = (previewResponse: unknown) => {
      dispatch(
        doOpenModal(MODALS.PUBLISH_PREVIEW, {
          previewResponse,
        })
      );
    };

    const publishSuccess = (successResponse: unknown, lbryFirstError: unknown) => {
      const state = getState();
      // @ts-expect-error - TS2741 (ts-migration)
      const myClaims = selectMyClaims(state);
      // @ts-expect-error - TS2339 - Property 'outputs' does not exist on type 'unknown'.
      const pendingClaim = successResponse.outputs[0];
      analytics.apiLogPublish(pendingClaim);
      const { permanent_url: url } = pendingClaim;
      const actions: unknown = [];

      // @if TARGET='app'
      // @ts-expect-error - TS2339 - Property 'push' does not exist on type 'unknown'.
      actions.push(push(`/$/${PAGES.UPLOADS}`));
      // @endif

      // @ts-expect-error - TS2339 - Property 'push' does not exist on type 'unknown'.
      actions.push({
        type: ACTIONS.PUBLISH_SUCCESS,
      });

      // We have to fake a temp claim until the new pending one is returned by claim_list_mine
      // We can't rely on claim_list_mine because there might be some delay before the new claims are returned
      // Doing this allows us to show the pending claim immediately, it will get overwritten by the real one
      // @ts-expect-error - TS2339 - Property 'claim_id' does not exist on type 'unknown'.
      const isMatch = (claim: unknown) => claim.claim_id === pendingClaim.claim_id;
      const isEdit = myClaims.some(isMatch);

      // @ts-expect-error - TS2339 - Property 'push' does not exist on type 'unknown'.
      actions.push({
        type: ACTIONS.UPDATE_PENDING_CLAIMS,
        data: {
          claims: [pendingClaim],
        },
      });
      // @if TARGET='app'
      // @ts-expect-error - TS2339 - Property 'push' does not exist on type 'unknown'.
      actions.push({
        type: ACTIONS.ADD_FILES_REFLECTING,
        data: pendingClaim,
      });
      // @endif

      // @ts-expect-error - TS2488 - Type 'unknown' must have a '[Symbol.iterator]()' method that returns an iterator.
      dispatch(batchActions(...actions));
      dispatch(
        doOpenModal(MODALS.PUBLISH, {
          uri: url,
          isEdit,
          filePath,
          lbryFirstError,
        })
      );
      // @ts-expect-error - TS2554 - Expected 1 arguments, but got 0.
      dispatch(doCheckPendingClaims());
      dispatch(doCheckReflectingFiles());
    };

    const publishFail = (error: unknown) => {
      const actions: unknown = [];
      // @ts-expect-error - TS2339 - Property 'push' does not exist on type 'unknown'.
      actions.push({
        type: ACTIONS.PUBLISH_FAIL,
      });
      // @ts-expect-error - TS2339 - Property 'push' does not exist on type 'unknown'. | TS2339 - Property 'message' does not exist on type 'unknown'.
      actions.push(doError(error.message));
      // @ts-expect-error - TS2488 - Type 'unknown' must have a '[Symbol.iterator]()' method that returns an iterator.
      dispatch(batchActions(...actions));
    };

    if (preview) {
      dispatch(doPublish(publishSuccess, publishFail, publishPreview));
      return;
    }

    // @ts-expect-error - TS2554 - Expected 3 arguments, but got 2.
    dispatch(doPublish(publishSuccess, publishFail));
  };

// The upload service has no status endpoint (spee.ch had one), so assume it's up: a failed upload
// says so, and the "Enter a thumbnail URL" option is always there.
export const doResetThumbnailStatus = () => (dispatch: Dispatch) =>
  dispatch({
    type: ACTIONS.UPDATE_PUBLISH_FORM,
    data: {
      thumbnailPath: "",
      thumbnailError: undefined,
      uploadThumbnailStatus: THUMBNAIL_STATUSES.READY,
      thumbnail: "",
    },
  });

export const doClearPublish = () => (dispatch: Dispatch) => {
  dispatch({ type: ACTIONS.CLEAR_PUBLISH });
  return dispatch(doResetThumbnailStatus());
};

export const doUpdatePublishForm = (publishFormValue: UpdatePublishFormData) => (dispatch: Dispatch) =>
  dispatch({
    type: ACTIONS.UPDATE_PUBLISH_FORM,
    data: { ...publishFormValue },
  });

export const doUploadThumbnail =
  (filePath?: string, thumbnailBlob?: File, fsAdapter?: any, fs?: any, path?: any, cb?: (arg1: string) => void) =>
  (dispatch: Dispatch) => {
    const downMessage = __("Thumbnail upload service may be down, try again later.");
    let thumbnail, fileExt, fileName, fileType;

    const uploadError = (error = "") => {
      dispatch(
        batchActions(
          {
            type: ACTIONS.UPDATE_PUBLISH_FORM,
            data: {
              uploadThumbnailStatus: THUMBNAIL_STATUSES.READY,
              thumbnail: "",
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

    const doUpload = (file: unknown) =>
      uploadImage(file)
        .then((url) => {
          if (cb) {
            cb(url);
          }
          return dispatch({
            type: ACTIONS.UPDATE_PUBLISH_FORM,
            data: {
              uploadThumbnailStatus: THUMBNAIL_STATUSES.COMPLETE,
              thumbnail: url,
            },
          });
        })
        .catch((err) => {
          let message = err.message;

          // This sucks but ¯\_(ツ)_/¯
          if (message === "Failed to fetch") {
            message = downMessage;
          }
          const userInput = [fileName, fileExt, fileType];
          uploadError(`${message}\nUser input:  ${userInput.join(", ")}`);
        });

    dispatch({
      type: ACTIONS.UPDATE_PUBLISH_FORM,
      data: { uploadThumbnailStatus: THUMBNAIL_STATUSES.IN_PROGRESS },
    });

    if (fsAdapter && fsAdapter.readFile && filePath) {
      const localPath = filePath;
      fsAdapter.readFile(localPath, "base64").then((base64Image) => {
        fileExt = "png";
        fileName = "thumbnail.png";
        fileType = "image/png";
        return doUpload({ uri: "file://" + localPath, type: fileType, name: fileName });
      });
    } else {
      if (filePath && fs && path) {
        thumbnail = fs.readFileSync(filePath);
        fileExt = path.extname(filePath);
        fileName = path.basename(filePath);
        fileType = `image/${fileExt.slice(1)}`;
      } else if (thumbnailBlob) {
        fileExt = `.${thumbnailBlob.type && thumbnailBlob.type.split("/")[1]}`;
        fileName = thumbnailBlob.name;
        fileType = thumbnailBlob.type;
      } else {
        return null;
      }

      const file = thumbnailBlob || (thumbnail && new File([thumbnail], fileName, { type: fileType }));
      return doUpload(file);
    }
  };

export const doPrepareEdit =
  (claim: StreamClaim, uri: string, fileInfo: FileListItem, fs: any) => (dispatch: Dispatch) => {
    const { name, amount, value = {} } = claim;
    const channelName = (claim && claim.signing_channel && claim.signing_channel.name) || null;
    const {
      // @ts-expect-error - TS2339 - Property 'author' does not exist on type '{}'.
      author,
      // @ts-expect-error - TS2339 - Property 'description' does not exist on type '{}'.
      description,
      // use same values as default state
      // fee will be undefined for free content
      // @ts-expect-error - TS2339 - Property 'fee' does not exist on type '{}'.
      fee = {
        amount: "0",
        currency: "LBC",
      },
      // @ts-expect-error - TS2339 - Property 'languages' does not exist on type '{}'.
      languages,
      // @ts-expect-error - TS2339 - Property 'release_time' does not exist on type '{}'.
      release_time,
      // @ts-expect-error - TS2339 - Property 'license' does not exist on type '{}'.
      license,
      // @ts-expect-error - TS2339 - Property 'license_url' does not exist on type '{}'.
      license_url: licenseUrl,
      // @ts-expect-error - TS2339 - Property 'thumbnail' does not exist on type '{}'.
      thumbnail,
      // @ts-expect-error - TS2339 - Property 'title' does not exist on type '{}'.
      title,
      // @ts-expect-error - TS2339 - Property 'tags' does not exist on type '{}'.
      tags,
    } = value;

    const publishData: UpdatePublishFormData = {
      name,
      bid: Number(amount),
      contentIsFree: fee.amount === "0",
      // @ts-expect-error - TS2322 - Type '{ name: string; bid: number; contentIsFree: boolean; author: any; description: any; fee: any; languages: any; releaseTime: any; releaseTimeEdited: undefined; thumbnail: any; title: any; uri: string; uploadThumbnailStatus: string; licenseUrl: any; nsfw: boolean; tags: any; }' is not assignable to type 'UpdatePublishFormData'.
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
      publishData["channel"] = channelName;
    }

    dispatch({ type: ACTIONS.DO_PREPARE_EDIT, data: publishData });
  };

export const doPublish =
  (success: (...args: any) => any, fail: (...args: any) => any, preview: (...args: any) => any) =>
  (dispatch: Dispatch, getState: () => Record<any, any>) => {
    if (!preview) {
      dispatch({ type: ACTIONS.PUBLISH_START });
    }

    const state = getState();
    const myClaimForUri = selectMyClaimForUri(state);
    // @ts-expect-error - TS2741 (ts-migration)
    const myChannels = selectMyChannelClaims(state);
    // get redux publish form
    const publishData = selectPublishFormValues(state);

    // destructure the data values
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
      tags,
      // locations,
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
    const namedChannelClaim = myChannels ? myChannels.find((myChannel) => myChannel.name === channel) : null;
    const channelId = namedChannelClaim ? namedChannelClaim.claim_id : "";

    const publishPayload: {
      name: string | null | undefined;
      bid: string;
      description?: string;
      channel_id?: string;
      file_path?: string;
      license_url?: string;
      license?: string;
      thumbnail_url?: string;
      release_time?: number;
      fee_currency?: string;
      fee_amount?: string;
      languages?: Array<string>;
      tags: Array<string>;
      locations?: Array<any>;
      blocking: boolean;
      optimize_file?: boolean;
      preview?: boolean;
      remote_url?: string;
    } = {
      name,
      // @ts-expect-error - TS2322 - Type '{ name: any; title: any; description: any; locations: undefined[]; bid: string; languages: any[]; tags: any; thumbnail_url: any; blocking: true; preview: false; }' is not assignable to type '{ name: string; bid: string; description?: string; channel_id?: string; file_path?: string; license_url?: string; license?: string; thumbnail_url?: string; release_time?: number; fee_currency?: string; ... 7 more ...; remote_url?: string; }'.
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
      publishPayload.tags.push("lbry-first");
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
    if (filePath) publishPayload.file_path = filePath;

    if (preview) {
      publishPayload.preview = true;
      publishPayload.optimize_file = false;

      return Lbry.publish(publishPayload).then((previewResponse: PublishResponse) => {
        return preview(previewResponse);
      }, fail);
    }

    return Lbry.publish(publishPayload).then((response: PublishResponse) => {
      return success(response);
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

    const newReflectingById: Record<string, any> = {};
    const promises: unknown = [];
    // TODO: just use file_list({claim_id: Array<claimId>})
    if (Object.keys(reflectingById).length) {
      ids.forEach((claimId) => {
        // @ts-expect-error - TS2339 - Property 'push' does not exist on type 'unknown'.
        promises.push(Lbry.file_list({ claim_id: claimId }));
      });

      // @ts-expect-error - TS2769 - No overload matches this call.
      Promise.all(promises)
        .then((results) => {
          results.forEach((res) => {
            // @ts-expect-error - TS2339 - Property 'items' does not exist on type 'unknown'.
            if (res.items[0]) {
              // @ts-expect-error - TS2339 - Property 'items' does not exist on type 'unknown'.
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
