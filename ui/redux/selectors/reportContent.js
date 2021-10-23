// @flow
type State = { reportContent: ReportContentState };

export const selectState = (state: State): ReportContentState => state.reportContent;
export const selectIsReportingContent: (state: State) => boolean = (state) => selectState(state).isReporting;
export const selectReportContentError: (state: State) => string = (state) => selectState(state).error;
