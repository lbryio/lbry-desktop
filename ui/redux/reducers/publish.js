// @flow
import { handleActions } from 'util/redux-utils';
import { buildURI } from 'util/lbryURI';
import { serializeFileObj } from 'util/file';
import {
  tusLockAndNotify,
  tusUnlockAndNotify,
  tusRemoveAndNotify,
  tusClearRemovedUploads,
  tusClearLockedUploads,
} from 'util/tus';
import * as ACTIONS from 'constants/action_types';
import * as THUMBNAIL_STATUSES from 'constants/thumbnail_upload_statuses';
import { CHANNEL_ANONYMOUS } from 'constants/claim';

// This is the old key formula. Retain it for now to allow users to delete
// any pending uploads. Can be removed from January 2022 onwards.
const getOldKeyFromParam = (params) => `${params.name}#${params.channel || 'anonymous'}`;

type PublishState = {
  editingURI: ?string,
  fileText: ?string,
  filePath: ?string,
  remoteFileUrl: ?string,
  contentIsFree: boolean,
  fileDur: number,
  fileSize: number,
  fileVid: boolean,
  fee: {
    amount: number,
    currency: string,
  },
  title: string,
  thumbnail_url: string,
  thumbnailPath: string,
  uploadThumbnailStatus: string,
  thumbnailError: ?boolean,
  description: string,
  language: string,
  releaseTime: ?number,
  releaseTimeEdited: ?number,
  releaseAnytime: boolean,
  channel: string,
  channelId: ?string,
  name: string,
  nameError: ?string,
  bid: number,
  bidError: ?string,
  otherLicenseDescription: string,
  licenseUrl: string,
  tags: Array<string>,
  optimize: boolean,
  useLBRYUploader: boolean,
  currentUploads: { [key: string]: FileUploadItem },
  isMarkdownPost: boolean,
  isLivestreamPublish: boolean,
};

const defaultState: PublishState = {
  editingURI: undefined,
  fileText: '',
  filePath: undefined,
  fileDur: 0,
  fileSize: 0,
  fileVid: false,
  remoteFileUrl: undefined,
  contentIsFree: true,
  fee: {
    amount: 1,
    currency: 'LBC',
  },
  title: '',
  thumbnail_url: '',
  thumbnailPath: '',
  uploadThumbnailStatus: THUMBNAIL_STATUSES.API_DOWN,
  thumbnailError: undefined,
  description: '',
  language: '',
  releaseTime: undefined,
  releaseTimeEdited: undefined,
  releaseTimeError: false,
  releaseAnytime: false,
  nsfw: false,
  channel: CHANNEL_ANONYMOUS,
  channelId: '',
  name: '',
  nameError: undefined,
  bid: 0.01,
  bidError: undefined,
  licenseType: 'None',
  otherLicenseDescription: 'All rights reserved',
  licenseUrl: '',
  tags: [],
  publishing: false,
  publishSuccess: false,
  publishError: undefined,
  optimize: false,
  useLBRYUploader: false,
  currentUploads: {},
  isMarkdownPost: false,
  isLivestreamPublish: false,
};

export const publishReducer = handleActions(
  {
    [ACTIONS.UPDATE_PUBLISH_FORM]: (state, action): PublishState => {
      const { data } = action;
      return {
        ...state,
        ...data,
      };
    },
    [ACTIONS.CLEAR_PUBLISH]: (state: PublishState): PublishState => ({
      ...defaultState,
      uri: undefined,
      channel: state.channel,
      bid: state.bid,
      optimize: state.optimize,
      language: state.language,
      currentUploads: state.currentUploads,
    }),
    [ACTIONS.PUBLISH_START]: (state: PublishState): PublishState => ({
      ...state,
      publishing: true,
      publishSuccess: false,
    }),
    [ACTIONS.PUBLISH_FAIL]: (state: PublishState): PublishState => ({
      ...state,
      publishing: false,
    }),
    [ACTIONS.PUBLISH_SUCCESS]: (state: PublishState): PublishState => ({
      ...state,
      publishing: false,
      publishSuccess: true,
    }),
    [ACTIONS.DO_PREPARE_EDIT]: (state: PublishState, action) => {
      const { ...publishData } = action.data;
      const { channel, name, uri } = publishData;

      // The short uri is what is presented to the user
      // The editingUri is the full uri with claim id
      const shortUri = buildURI({
        channelName: channel,
        streamName: name,
      });

      return {
        ...defaultState,
        ...publishData,
        editingURI: uri,
        uri: shortUri,
        currentUploads: state.currentUploads,
      };
    },
    [ACTIONS.UPDATE_UPLOAD_ADD]: (state: PublishState, action) => {
      const { file, params, uploader } = action.data;
      const currentUploads = Object.assign({}, state.currentUploads);

      currentUploads[params.guid] = {
        file,
        fileFingerprint: file ? serializeFileObj(file) : undefined, // TODO: get hash instead?
        progress: '0',
        params,
        uploader,
        resumable: !(uploader instanceof XMLHttpRequest),
      };

      return { ...state, currentUploads };
    },
    [ACTIONS.UPDATE_UPLOAD_PROGRESS]: (state: PublishState, action) => {
      const { guid, progress, status } = action.data;
      const key = guid;
      const currentUploads = Object.assign({}, state.currentUploads);

      if (guid === 'force--update') {
        return { ...state, currentUploads };
      } else if (guid === 'refresh--lock') {
        // Re-lock all uploads that are in progress under our tab.
        const uploadKeys = Object.keys(currentUploads);
        uploadKeys.forEach((k) => {
          if (currentUploads[k].uploader) {
            tusLockAndNotify(k);
          }
        });
      }

      if (!currentUploads[key]) {
        return state;
      }

      if (progress) {
        currentUploads[key].progress = progress;
        delete currentUploads[key].status;

        if (currentUploads[key].uploader.url) {
          // TUS has finally obtained an upload url from the server...
          if (!currentUploads[key].params.uploadUrl) {
            // ... Stash that to check later when resuming.
            // Ignoring immutable-update requirement (probably doesn't matter to the GUI).
            currentUploads[key].params.uploadUrl = currentUploads[key].uploader.url;
          }

          // ... lock this tab as the active uploader.
          tusLockAndNotify(key);
        }
      } else if (status) {
        currentUploads[key].status = status;
        if (status === 'error' || status === 'conflict') {
          delete currentUploads[key].uploader;
        }
      }

      return { ...state, currentUploads };
    },
    [ACTIONS.UPDATE_UPLOAD_REMOVE]: (state: PublishState, action) => {
      const { guid, params } = action.data;
      const key = guid || getOldKeyFromParam(params);

      if (state.currentUploads[key]) {
        const currentUploads = Object.assign({}, state.currentUploads);
        delete currentUploads[key];
        tusUnlockAndNotify(key);
        tusRemoveAndNotify(key);

        return { ...state, currentUploads };
      }

      return state;
    },
    [ACTIONS.REHYDRATE]: (state: PublishState, action) => {
      if (action && action.payload && action.payload.publish) {
        const newPublish = { ...action.payload.publish };

        // Cleanup for 'publish::currentUploads'
        if (newPublish.currentUploads) {
          const uploadKeys = Object.keys(newPublish.currentUploads);
          if (uploadKeys.length > 0) {
            // Clear uploader and corrupted params
            uploadKeys.forEach((key) => {
              const params = newPublish.currentUploads[key].params;
              if (!params || Object.keys(params).length === 0) {
                // The intended payload for the API is corrupted, so no point
                // retaining. Remove from the pending-uploads list.
                delete newPublish.currentUploads[key];
              } else {
                // The data is still good, so we can resume upload. We just need
                // to delete the previous reference of the tus-uploader (no
                // longer functional, will be re-created). An empty 'uploader'
                // also tells the GUI that we just rebooted.
                delete newPublish.currentUploads[key].uploader;
              }
            });
          } else {
            tusClearRemovedUploads();
          }

          tusClearLockedUploads();
        }

        return newPublish;
      }

      return state;
    },
  },
  defaultState
);
