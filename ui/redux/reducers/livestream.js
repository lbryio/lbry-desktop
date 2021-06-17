// @flow
import * as ACTIONS from 'constants/action_types';
import { handleActions } from 'util/redux-utils';

const defaultState: LivestreamState = {
  fetchingById: {},
  viewersById: {},
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
  },
  defaultState
);
