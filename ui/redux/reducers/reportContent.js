// @flow
import * as ACTIONS from 'constants/action_types';
import { handleActions } from 'util/redux-utils';

const defaultState: ReportContentState = {
  isReporting: false,
  error: '',
};

export default handleActions(
  {
    [ACTIONS.REPORT_CONTENT_STARTED]: (state: ReportContentState): ReportContentState => ({
      ...state,
      isReporting: true,
      error: '',
    }),
    [ACTIONS.REPORT_CONTENT_COMPLETED]: (state: ReportContentState): ReportContentState => ({
      ...state,
      isReporting: false,
      error: '',
    }),
    [ACTIONS.REPORT_CONTENT_FAILED]: (state: ReportContentState, action): ReportContentState => ({
      ...state,
      isReporting: false,
      error: action.data,
    }),
  },
  defaultState
);
