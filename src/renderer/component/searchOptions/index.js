import { connect } from 'react-redux';
import {
  selectSearchOptions,
  doUpdateSearchOptions,
  makeSelectQueryWithOptions,
  doToast,
} from 'lbry-redux';
import { doToggleSearchExpanded } from 'redux/actions/app';
import { selectSearchOptionsExpanded } from 'redux/selectors/app';
import analytics from 'analytics';
import SearchOptions from './view';

const select = state => ({
  options: selectSearchOptions(state),
  expanded: selectSearchOptionsExpanded(state),
  query: makeSelectQueryWithOptions()(state),
});

const perform = dispatch => ({
  setSearchOption: (option, value) => dispatch(doUpdateSearchOptions({ [option]: value })),
  toggleSearchExpanded: () => dispatch(doToggleSearchExpanded()),
  onFeedbackPositive: query => {
    analytics.apiSearchFeedback(query, 1);
    dispatch(
      doToast({
        message: __('Thanks for the feedback! You help make the app better for everyone.'),
      })
    );
  },
  onFeedbackNegative: query => {
    analytics.apiSearchFeedback(query, 0);
    dispatch(
      doToast({
        message: __(
          'Thanks for the feedback. Mark has been notified and is currently walking over to his computer to work on this.'
        ),
      })
    );
  },
});

export default connect(
  select,
  perform
)(SearchOptions);
