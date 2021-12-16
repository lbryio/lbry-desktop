// @flow

import * as ACTIONS from 'constants/action_types';
import { handleActions } from 'util/redux-utils';

const currentChannelStatus: LivestreamChannelStatus = {
  channelId: null,
  isBroadcasting: false,
  liveClaim: {
    claimId: null,
    claimUri: null,
  },
};

const defaultState: LivestreamState = {
  fetchingById: {},
  viewersById: {},
  fetchingActiveLivestreams: 'pending',
  activeLivestreams: null,
  activeLivestreamsLastFetchedDate: 0,
  activeLivestreamsLastFetchedOptions: {},

  currentChannelStatus: {
    ...currentChannelStatus,
  },
};

export default handleActions(
  {
    [ACTIONS.FETCH_NO_SOURCE_CLAIMS_STARTED]: (state: LivestreamState, action: any): LivestreamState => {
      const claimId = action.data;
      const newIdsFetching = Object.assign({}, state.fetchingById);
      newIdsFetching[claimId] = true;

      return { ...state, fetchingById: newIdsFetching };
    },
    [ACTIONS.FETCH_NO_SOURCE_CLAIMS_COMPLETED]: (state: LivestreamState, action: any): LivestreamState => {
      const claimId = action.data;
      const newIdsFetching = Object.assign({}, state.fetchingById);
      newIdsFetching[claimId] = false;

      return { ...state, fetchingById: newIdsFetching };
    },
    [ACTIONS.FETCH_NO_SOURCE_CLAIMS_FAILED]: (state: LivestreamState, action: any) => {
      const claimId = action.data;
      const newIdsFetching = Object.assign({}, state.fetchingById);
      newIdsFetching[claimId] = false;

      return { ...state, fetchingById: newIdsFetching };
    },
    [ACTIONS.VIEWERS_RECEIVED]: (state: LivestreamState, action: any) => {
      const { connected, claimId } = action.data;
      const newViewersById = Object.assign({}, state.viewersById);
      newViewersById[claimId] = connected;
      return { ...state, viewersById: newViewersById };
    },
    [ACTIONS.FETCH_ACTIVE_LIVESTREAMS_STARTED]: (state: LivestreamState) => {
      return { ...state, fetchingActiveLivestreams: true };
    },
    [ACTIONS.FETCH_ACTIVE_LIVESTREAMS_FAILED]: (state: LivestreamState) => {
      return { ...state, fetchingActiveLivestreams: false };
    },
    [ACTIONS.FETCH_ACTIVE_LIVESTREAMS_COMPLETED]: (state: LivestreamState, action: any) => {
      const { activeLivestreams, activeLivestreamsLastFetchedDate, activeLivestreamsLastFetchedOptions } = action.data;
      return {
        ...state,
        fetchingActiveLivestreams: false,
        activeLivestreams,
        activeLivestreamsLastFetchedDate,
        activeLivestreamsLastFetchedOptions,
      };
    },

    [ACTIONS.FETCH_ACTIVE_LIVESTREAM_COMPLETED]: (state: LivestreamState, action: any) => {
      const currentChannelStatus = Object.assign({}, state.currentChannelStatus, {
        isBroadcasting: true,
        liveClaim: action.data.liveClaim,
      });
      return { ...state, currentChannelStatus };
    },
    [ACTIONS.FETCH_ACTIVE_LIVESTREAM_FAILED]: (state: LivestreamState) => {
      const currentChannelStatus = Object.assign({}, state.currentChannelStatus, {
        isBroadcasting: false,
        liveClaim: { claimId: null, claimUri: null },
      });
      return { ...state, currentChannelStatus };
    },
    [ACTIONS.FETCH_ACTIVE_LIVESTREAM_FINISHED]: (state: LivestreamState, action: any) => {
      const currentChannelStatus = Object.assign({}, state.currentChannelStatus, { channelId: action.data.channelId });
      return { ...state, currentChannelStatus };
    },
  },
  defaultState
);
