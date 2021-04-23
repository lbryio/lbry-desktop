// @flow
import * as ACTIONS from 'constants/action_types';
import { handleActions } from 'util/redux-utils';

const defaultState: LivestreamState = {
  idsFetching: {},
};

export default handleActions(
  {
    [ACTIONS.FETCH_NO_SOURCE_CLAIMS_STARTED]: (state: LivestreamState, action: any): LivestreamState => {
      const claimId = action.data;
      const newIdsFetching = Object.assign({}, state.idsFetching);
      newIdsFetching[claimId] = true;

      return { ...state, idsFetching: newIdsFetching };
    },
    [ACTIONS.FETCH_NO_SOURCE_CLAIMS_COMPLETED]: (state: LivestreamState, action: any): LivestreamState => {
      const claimId = action.data;
      const newIdsFetching = Object.assign({}, state.idsFetching);
      newIdsFetching[claimId] = false;

      return { ...state, idsFetching: newIdsFetching };
    },
    [ACTIONS.FETCH_NO_SOURCE_CLAIMS_FAILED]: (state: LivestreamState, action: any) => {
      const claimId = action.data;
      const newIdsFetching = Object.assign({}, state.idsFetching);
      newIdsFetching[claimId] = false;

      return { ...state, idsFetching: newIdsFetching };
    },
  },
  defaultState
);
