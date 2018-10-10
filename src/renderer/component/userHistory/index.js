import { connect } from 'react-redux';
import { selectHistoryPageCount, makeSelectHistoryForPage } from 'redux/selectors/content';
import { doNavigate } from 'redux/actions/navigation';
import { selectCurrentParams, makeSelectCurrentParam } from 'lbry-redux';
import { doClearContentHistoryUri } from 'redux/actions/content';
import UserHistory from './view';

const select = state => {
  const paramPage = Number(makeSelectCurrentParam('page')(state) || 0);
  return {
    pageCount: selectHistoryPageCount(state),
    page: paramPage,
    params: selectCurrentParams(state),
    history: makeSelectHistoryForPage(paramPage)(state),
  };
};

const perform = dispatch => ({
  navigate: (path, params) => dispatch(doNavigate(path, params)),
  clearHistoryUri: uri => dispatch(doClearContentHistoryUri(uri)),
});

export default connect(
  select,
  perform
)(UserHistory);
