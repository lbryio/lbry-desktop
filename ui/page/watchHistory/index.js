import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import WatchHistoryPage from './view';
import { makeSelectClaimForClaimId, makeSelectChannelForClaimUri } from 'redux/selectors/claims';
import { selectHistory } from 'redux/selectors/content';
import { doClearContentHistoryAll } from 'redux/actions/content';
import { selectUser } from 'redux/selectors/user';

const select = (state, props) => {
  const { match } = props;
  const { params } = match;
  const { collectionId } = params;

  const claim = collectionId && makeSelectClaimForClaimId(collectionId)(state);
  const uri = (claim && (claim.canonical_url || claim.permanent_url)) || null;

  return {
    selectHistory: selectHistory(state, uri),
    uri,
    user: selectUser(state),
    channel: uri && makeSelectChannelForClaimUri(uri)(state),
  };
};

const perform = (dispatch) => ({
  doClearContentHistoryAll: () => dispatch(doClearContentHistoryAll()),
});

export default withRouter(connect(select, perform)(WatchHistoryPage));
