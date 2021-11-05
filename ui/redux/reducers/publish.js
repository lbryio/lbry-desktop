// @flow
import { handleActions } from 'util/redux-utils';
import { buildURI } from 'util/lbryURI';
import { serializeFileObj } from 'util/file';
import * as ACTIONS from 'constants/action_types';
import * as THUMBNAIL_STATUSES from 'constants/thumbnail_upload_statuses';
import { CHANNEL_ANONYMOUS } from 'constants/claim';

const getKeyFromParam = (params) => `${params.name}#${params.channel || 'anonymous'}`;

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
      const { file, params, tusUploader } = action.data;
      const key = getKeyFromParam(params);
      const currentUploads = Object.assign({}, state.currentUploads);

      currentUploads[key] = {
        file,
        fileFingerprint: serializeFileObj(file), // TODO: get hash instead?
        progress: '0',
        params,
        tusUploader,
      };

      return { ...state, currentUploads };
    },
    [ACTIONS.UPDATE_UPLOAD_PROGRESS]: (state: PublishState, action) => {
      const { params, progress, status } = action.data;
      const key = getKeyFromParam(params);
      const currentUploads = Object.assign({}, state.currentUploads);

      if (progress) {
        currentUploads[key].progress = progress;
        delete currentUploads[key].status;
      } else if (status) {
        currentUploads[key].status = status;
        if (status === 'error') {
          delete currentUploads[key].tusUploader;
        }
      }

      return { ...state, currentUploads };
    },
    [ACTIONS.UPDATE_UPLOAD_REMOVE]: (state: PublishState, action) => {
      const { params } = action.data;
      const key = getKeyFromParam(params);
      const currentUploads = Object.assign({}, state.currentUploads);

      delete currentUploads[key];

      return { ...state, currentUploads };
    },
    [ACTIONS.REHYDRATE]: (state: PublishState, action) => {
      if (action && action.payload && action.payload.publish) {
        const newPublish = { ...action.payload.publish };

        // Cleanup for 'publish::currentUploads'
        if (newPublish.currentUploads) {
          Object.keys(newPublish.currentUploads).forEach((key) => {
            delete newPublish.currentUploads[key].tusUploader;
          });
        }

        return newPublish;
      }

      return state;
    },
  },
  defaultState
);
