import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import WatchHistoryPage from './view';
import { selectHistory } from 'redux/selectors/content';
import { doClearContentHistoryAll } from 'redux/actions/content';

const select = (state) => {
  return {
    history: selectHistory(state),
  };
};

const perform = (dispatch) => ({
  doClearContentHistoryAll: () => dispatch(doClearContentHistoryAll()),
});

export default withRouter(connect(select, perform)(WatchHistoryPage));
