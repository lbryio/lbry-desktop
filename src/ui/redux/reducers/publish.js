// @flow
import { handleActions } from 'util/redux-utils';
import { buildURI } from 'lbry-redux';
import * as ACTIONS from 'constants/action_types';
import * as THUMBNAIL_STATUSES from 'constants/thumbnail_upload_statuses';
import { CHANNEL_ANONYMOUS } from 'constants/claim';

type PublishState = {
  editingURI: ?string,
  filePath: ?string,
  contentIsFree: boolean,
  fee: {
    amount: number,
    currency: string,
  },
  title: string,
  thumbnail_url: string,
  thumbnailPath: string,
  uploadThumbnailStatus: string,
  description: string,
  language: string,
  channel: string,
  channelId: ?string,
  name: string,
  nameError: ?string,
  bid: number,
  bidError: ?string,
  otherLicenseDescription: string,
  licenseUrl: string,
};

const defaultState: PublishState = {
  editingURI: undefined,
  filePath: undefined,
  contentIsFree: true,
  fee: {
    amount: 1,
    currency: 'LBC',
  },
  title: '',
  thumbnail_url: '',
  thumbnailPath: '',
  uploadThumbnailStatus: THUMBNAIL_STATUSES.API_DOWN,
  description: '',
  language: 'en',
  nsfw: false,
  channel: CHANNEL_ANONYMOUS,
  channelId: '',
  name: '',
  nameError: undefined,
  bid: 0.1,
  bidError: undefined,
  licenseType: 'None',
  otherLicenseDescription: 'All rights reserved',
  licenseUrl: '',
  publishing: false,
  publishSuccess: false,
  publishError: undefined,
};

export default handleActions(
  {
    [ACTIONS.UPDATE_PUBLISH_FORM]: (state, action): PublishState => {
      const { data } = action;
      return {
        ...state,
        ...data,
      };
    },
    [ACTIONS.CLEAR_PUBLISH]: (): PublishState => ({
      ...defaultState,
    }),
    [ACTIONS.PUBLISH_START]: (state: PublishState): PublishState => ({
      ...state,
      publishing: true,
    }),
    [ACTIONS.PUBLISH_FAIL]: (state: PublishState): PublishState => ({
      ...state,
      publishing: false,
    }),
    [ACTIONS.PUBLISH_SUCCESS]: (state: PublishState): PublishState => ({
      ...state,
      publishing: false,
    }),
    [ACTIONS.DO_PREPARE_EDIT]: (state: PublishState, action) => {
      const { ...publishData } = action.data;
      const { channel, name, uri } = publishData;

      // The short uri is what is presented to the user
      // The editingUri is the full uri with claim id
      const shortUri = buildURI({
        channelName: channel,
        contentName: name,
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
