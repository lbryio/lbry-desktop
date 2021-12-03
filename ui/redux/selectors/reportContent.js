// @flow
import { createSelector } from 'reselect';

type State = { reportContent: ReportContentState };

export const selectState = (state: State): ReportContentState => state.reportContent;

export const selectIsReportingContent: (state: State) => boolean = createSelector(
  selectState,
  (state) => state.isReporting
);

export const selectReportContentError: (state: State) => string = createSelector(selectState, (state) => state.error);
