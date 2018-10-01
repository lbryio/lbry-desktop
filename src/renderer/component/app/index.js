import { connect } from 'react-redux';
import { selectPageTitle, selectHistoryIndex, selectActiveHistoryEntry } from 'lbry-redux';
import { doRecordScroll } from 'redux/actions/navigation';
import { selectUser } from 'lbryinc';
import { doAlertError } from 'redux/actions/app';
import App from './view';

const select = state => ({
  pageTitle: selectPageTitle(state),
  user: selectUser(state),
  currentStackIndex: selectHistoryIndex(state),
  currentPageAttributes: selectActiveHistoryEntry(state),
});

const perform = dispatch => ({
  alertError: errorList => dispatch(doAlertError(errorList)),
  recordScroll: scrollPosition => dispatch(doRecordScroll(scrollPosition)),
});

export default connect(
  select,
  perform
)(App);
