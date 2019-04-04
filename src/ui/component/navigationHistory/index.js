import { connect } from 'react-redux';
import { selectHistoryPageCount, makeSelectHistoryForPage } from 'redux/selectors/content';
import { doClearContentHistoryUri } from 'redux/actions/content';
import UserHistory from './view';

const select = (state, props) => {
  const { search } = props.location;
  const urlParams = new URLSearchParams(search);
  const page = Number(urlParams.get('page')) || 0;

  return {
    page,
    pageCount: selectHistoryPageCount(state),
    historyItems: makeSelectHistoryForPage(page)(state),
  };
};

const perform = dispatch => ({
  clearHistoryUri: uri => dispatch(doClearContentHistoryUri(uri)),
});

export default connect(
  select,
  perform
)(UserHistory);
