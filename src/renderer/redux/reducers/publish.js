// @flow
import { handleActions } from 'util/redux-utils';
import * as ACTIONS from 'constants/action_types';

type PublishState = {
  filePath: ?string,
  contentIsFree: boolean,
  price: {
    amount: number,
    currency: string,
  },
  title: string,
  thumbnail: string,
  description: string,
  language: string,
  tosAccepted: boolean,
  channel: string,
  name: string,
  nameError: ?string,
  bid: number,
  bidError: ?string,
  otherLicenseDescription: string,
  licenseUrl: string,
  copyrightNotice: string,
  pendingPublishes: Array<any>
}

export type UpdatePublishFormData = {
  filePath?: string,
  contentIsFree?: boolean,
  price?: {
    amount: number,
    currency: string,
  },
  title?: string,
  thumbnail?: string,
  description?: string,
  language?: string,
  tosAccepted?: boolean,
  channel?: string,
  name?: string,
  nameError?: string,
  bid?: number,
  bidError?: string,
  otherLicenseDescription?: string,
  licenseUrl?: string,
  copyrightNotice?: string,
}

export type UpdatePublishFormAction = {
  type: string,
  data: UpdatePublishFormData,
}

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
  title: string,
  contentIsFree: boolean,
  uri: string,
  price: {
    currency: string,
    amount: number,
  },
}

const defaultState: PublishState = {
  filePath: undefined,
  contentIsFree: true,
  price: {
    amount: 1,
    currency: "LBC"
  },
  title: "",
  thumbnail: "",
  description: "",
  language: "en",
  nsfw: false,
  channel: "anonymous",
  tosAccepted: false,
  name: "",
  nameError: undefined,
  bid: 0.5,
  bidError: undefined,
  licenseType: "None",
  otherLicenseDescription: "",
  licenseUrl: "",
  copyrightNotice: "All rights reserved",
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
        ...data
      }
    },
    [ACTIONS.CLEAR_PUBLISH]: (state: PublishState): PublishState => {
      const { pendingPublishes } = state;
      return { ...defaultState, pendingPublishes }
    },
    [ACTIONS.PUBLISH_START]: (state: PublishState): PublishState => ({
      ...state,
      publishing: true
    }),
    [ACTIONS.PUBLISH_FAIL]: (state: PublishState): PublishState => ({
        ...state,
        publishing: false
    }),
    [ACTIONS.PUBLISH_SUCCESS]: (state: PublishState, action): PublishState => {
      const { pendingPublish } = action.data;

      const newPendingPublishes = state.pendingPublishes.slice();
      newPendingPublishes.push(pendingPublish);

      return {
        ...state,
        publishing: false,
        pendingPublishes: newPendingPublishes
      }
    },
    [ACTIONS.REMOVE_PENDING_PUBLISH]: (state: PublishState, action) => {
      const { name } =  action.data;
      const pendingPublishes = state.pendingPublishes.filter((publish) => publish.name !== name);
      return {
        ...state,
        pendingPublishes
      }
    }
  },
  defaultState
);
