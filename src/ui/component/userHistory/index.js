import { connect } from 'react-redux';
import { selectHistoryPageCount, makeSelectHistoryForPage } from 'redux/selectors/content';
import { selectCurrentParams, makeSelectCurrentParam } from 'lbry-redux';
import { doClearContentHistoryUri } from 'redux/actions/content';
import UserHistory from './view';

const select = state => ({
  pageCount: selectHistoryPageCount(state),
  // history: makeSelectHistoryForPage(paramPage)(state),
});

const perform = dispatch => ({
  clearHistoryUri: uri => dispatch(doClearContentHistoryUri(uri)),
});

export default connect(
  select,
  perform
)(UserHistory);
