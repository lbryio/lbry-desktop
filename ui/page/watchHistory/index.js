import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import WatchHistoryPage from './view';
import { selectWatchHistoryUris } from 'redux/selectors/content';
import { doClearContentHistoryAll } from 'redux/actions/content';
import { doResolveUris } from 'redux/actions/claims';

const select = (state) => ({
  historyUris: selectWatchHistoryUris(state),
});

const perform = {
  doClearContentHistoryAll,
  doResolveUris,
};

export default withRouter(connect(select, perform)(WatchHistoryPage));
