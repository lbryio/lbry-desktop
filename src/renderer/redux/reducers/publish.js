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
  price: {
    amount: number,
    currency: string,
  },
  title: string,
  thumbnail: string,
  thumbnailPath: string,
  uploadThumbnailStatus: string,
  description: string,
  language: string,
  tosAccepted: boolean,
  channel: string,
  channelId: ?string,
  name: string,
  nameError: ?string,
  bid: number,
  bidError: ?string,
  otherLicenseDescription: string,
  licenseUrl: string,
  copyrightNotice: string,
  pendingPublishes: Array<any>,
};

export type UpdatePublishFormData = {
  filePath?: string,
  contentIsFree?: boolean,
  price?: {
    amount: number,
    currency: string,
  },
  title?: string,
  thumbnail?: string,
  uploadThumbnailStatus?: string,
  thumbnailPath?: string,
  description?: string,
  language?: string,
  tosAccepted?: boolean,
  channel?: string,
  channelId?: string,
  name?: string,
  nameError?: string,
  bid?: number,
  bidError?: string,
  otherLicenseDescription?: string,
  licenseUrl?: string,
  copyrightNotice?: string,
};

export type UpdatePublishFormAction = {
  type: ACTIONS.UPDATE_PUBLISH_FORM | ACTIONS.DO_PREPARE_EDIT,
  data: UpdatePublishFormData,
};

export type PublishParams = {
  name: string,
  bid: number,
  filePath: string,
  description: ?string,
  language: string,
  publishingLicense: string,
  publishingLicenseUrl: string,
  thumbnail: ?string,
  nsfw: boolean,
  channel: string,
  channelId: string,
  title: string,
  contentIsFree: boolean,
  uri: string,
  license: ?string,
  licenseUrl: ?string,
  price: {
    currency: string,
    amount: number,
  },
  source?: {
    contentType: string,
    source: string,
    sourceType: string,
    version: string,
  },
};

const defaultState: PublishState = {
  editingURI: undefined,
  filePath: undefined,
  contentIsFree: true,
  price: {
    amount: 1,
    currency: 'LBC',
  },
  title: '',
  thumbnail: '',
  thumbnailPath: '',
  uploadThumbnailStatus: THUMBNAIL_STATUSES.API_DOWN,
  description: '',
  language: 'en',
  nsfw: false,
  channel: CHANNEL_ANONYMOUS,
  channelId: '',
  tosAccepted: false,
  name: '',
  nameError: undefined,
  bid: 0.1,
  bidError: undefined,
  licenseType: 'None',
  otherLicenseDescription: '',
  licenseUrl: '',
  copyrightNotice: 'All rights reserved',
  publishing: false,
  publishSuccess: false,
  publishError: undefined,
  pendingPublishes: [],
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
    [ACTIONS.CLEAR_PUBLISH]: (state: PublishState): PublishState => {
      const { pendingPublishes } = state;
      return { ...defaultState, pendingPublishes };
    },
    [ACTIONS.PUBLISH_START]: (state: PublishState): PublishState => ({
      ...state,
      publishing: true,
    }),
    [ACTIONS.PUBLISH_FAIL]: (state: PublishState): PublishState => ({
      ...state,
      publishing: false,
    }),
    [ACTIONS.PUBLISH_SUCCESS]: (state: PublishState, action): PublishState => {
      const { pendingPublish } = action.data;

      const newPendingPublishes = state.pendingPublishes.slice();

      newPendingPublishes.push(pendingPublish);

      return {
        ...state,
        publishing: false,
        pendingPublishes: newPendingPublishes,
      };
    },
    [ACTIONS.REMOVE_PENDING_PUBLISH]: (state: PublishState, action) => {
      const { name } = action.data;
      const pendingPublishes = state.pendingPublishes.filter(publish => publish.name !== name);
      return {
        ...state,
        pendingPublishes,
      };
    },
    [ACTIONS.DO_PREPARE_EDIT]: (state: PublishState, action) => {
      const { pendingPublishes } = state;
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
        pendingPublishes,
        editingURI: uri,
        uri: shortUri,
      };
    },
  },
  defaultState
);
