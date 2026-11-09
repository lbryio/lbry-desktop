import {handleActions} from 'util/redux-utils';
import { buildURI } from 'util/lbryURI';
import * as ACTIONS from 'constants/action_types';
import * as THUMBNAIL_STATUSES from 'constants/thumbnail_upload_statuses';
import { CHANNEL_ANONYMOUS } from 'constants/claim';

type PublishState = {
  editingURI: string | null | undefined,
  fileText: string | null | undefined,
  filePath: string | null | undefined,
  remoteFileUrl: string | null | undefined,
  contentIsFree: boolean,
  fileDur: number,
  fileSize: number,
  fileVid: boolean,
  fee: {
    amount: number,
    currency: string
  },
  title: string,
  thumbnail_url: string,
  thumbnailPath: string,
  uploadThumbnailStatus: string,
  thumbnailError: boolean | null | undefined,
  description: string,
  language: string,
  releaseTime: number | null | undefined,
  releaseTimeEdited: number | null | undefined,
  channel: string,
  channelId: string | null | undefined,
  name: string,
  nameError: string | null | undefined,
  bid: number,
  bidError: string | null | undefined,
  otherLicenseDescription: string,
  licenseUrl: string,
  tags: Array<string>,
  optimize: boolean,
  useLBRYUploader: boolean
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
// @ts-expect-error - TS2322 - Type '{ editingURI: undefined; fileText: string; filePath: undefined; fileDur: number; fileSize: number; fileVid: false; remoteFileUrl: undefined; contentIsFree: true; fee: { amount: number; currency: string; }; ... 24 more ...; useLBRYUploader: false; }' is not assignable to type 'PublishState'.
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
// @ts-expect-error - TS2322 - Type '{ uri: undefined; channel: string; bid: number; optimize: boolean; language: string; editingURI: string; fileText: string; filePath: string; remoteFileUrl: string; contentIsFree: boolean; fileDur: number; ... 18 more ...; useLBRYUploader: boolean; }' is not assignable to type 'PublishState'.
      uri: undefined,
      channel: state.channel,
      bid: state.bid || 0.01,
      optimize: state.optimize,
      language: state.language,
    }),
    [ACTIONS.PUBLISH_START]: (state: PublishState): PublishState => ({
      ...state,
// @ts-expect-error - TS2322 - Type '{ publishing: boolean; publishSuccess: boolean; editingURI: string; fileText: string; filePath: string; remoteFileUrl: string; contentIsFree: boolean; fileDur: number; fileSize: number; fileVid: boolean; ... 20 more ...; useLBRYUploader: boolean; }' is not assignable to type 'PublishState'.
      publishing: true,
      publishSuccess: false,
    }),
    [ACTIONS.PUBLISH_FAIL]: (state: PublishState): PublishState => ({
      ...state,
// @ts-expect-error - TS2322 - Type '{ publishing: boolean; editingURI: string; fileText: string; filePath: string; remoteFileUrl: string; contentIsFree: boolean; fileDur: number; fileSize: number; fileVid: boolean; fee: { amount: number; currency: string; }; ... 19 more ...; useLBRYUploader: boolean; }' is not assignable to type 'PublishState'.
      publishing: false,
    }),
    [ACTIONS.PUBLISH_SUCCESS]: (state: PublishState): PublishState => ({
      ...state,
// @ts-expect-error - TS2322 - Type '{ publishing: boolean; publishSuccess: boolean; editingURI: string; fileText: string; filePath: string; remoteFileUrl: string; contentIsFree: boolean; fileDur: number; fileSize: number; fileVid: boolean; ... 20 more ...; useLBRYUploader: boolean; }' is not assignable to type 'PublishState'.
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
      };
    },
  },
  defaultState
);
