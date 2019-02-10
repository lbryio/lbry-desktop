import { connect } from 'react-redux';
import {
  selectPageTitle,
  selectHistoryIndex,
  selectActiveHistoryEntry,
  doUpdateBlockHeight,
  doError,
} from 'lbry-redux';
import { doRecordScroll } from 'redux/actions/navigation';
import { doToggleEnhancedLayout } from 'redux/actions/app';
import { selectUser } from 'lbryinc';
import { selectThemePath } from 'redux/selectors/settings';
import { selectEnhancedLayout } from 'redux/selectors/app';
import App from './view';

const select = state => ({
  pageTitle: selectPageTitle(state),
  user: selectUser(state),
  currentStackIndex: selectHistoryIndex(state),
  currentPageAttributes: selectActiveHistoryEntry(state),
  theme: selectThemePath(state),
  enhancedLayout: selectEnhancedLayout(state),
});

const perform = dispatch => ({
  alertError: errorList => dispatch(doError(errorList)),
  recordScroll: scrollPosition => dispatch(doRecordScroll(scrollPosition)),
  updateBlockHeight: () => dispatch(doUpdateBlockHeight()),
  toggleEnhancedLayout: () => dispatch(doToggleEnhancedLayout()),
});

export default connect(
  select,
  perform
)(App);
