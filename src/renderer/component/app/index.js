import { connect } from 'react-redux';
import { selectPageTitle, selectHistoryIndex, selectActiveHistoryEntry, doError } from 'lbry-redux';
import { doRecordScroll } from 'redux/actions/navigation';
import { selectUser } from 'lbryinc';
import { selectThemePath } from 'redux/selectors/settings';
import App from './view';

const select = state => ({
  pageTitle: selectPageTitle(state),
  user: selectUser(state),
  currentStackIndex: selectHistoryIndex(state),
  currentPageAttributes: selectActiveHistoryEntry(state),
  theme: selectThemePath(state),
});

const perform = dispatch => ({
  alertError: errorList => dispatch(doError(errorList)),
  recordScroll: scrollPosition => dispatch(doRecordScroll(scrollPosition)),
});

export default connect(
  select,
  perform
)(App);
