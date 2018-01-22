import { connect } from 'react-redux';
import {
  doRecordScroll,
  selectPageTitle,
  selectHistoryIndex,
  selectActiveHistoryEntry,
} from 'lbry-redux';
import { selectUser } from 'redux/selectors/user';
import { doAlertError } from 'redux/actions/app';
import App from './view';

// eslint-disable-next-line no-unused-vars
const select = (state, props) => ({
  pageTitle: selectPageTitle(state),
  user: selectUser(state),
  currentStackIndex: selectHistoryIndex(state),
  currentPageAttributes: selectActiveHistoryEntry(state),
});

const perform = dispatch => ({
  alertError: errorList => dispatch(doAlertError(errorList)),
  recordScroll: scrollPosition => dispatch(doRecordScroll(scrollPosition)),
});

export default connect(select, perform)(App);
