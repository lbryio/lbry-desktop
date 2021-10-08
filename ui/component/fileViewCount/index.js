import { connect } from 'react-redux';
import { makeSelectClaimForUri } from 'lbry-redux';
import { doFetchViewCount, makeSelectViewCountForUri } from 'lbryinc';
import { doAnalyticsView } from 'redux/actions/app';
import FileViewCount from './view';

const select = (state, props) => ({
  claim: makeSelectClaimForUri(props.uri)(state),
  viewCount: makeSelectViewCountForUri(props.uri)(state),
});

const perform = (dispatch) => ({
  fetchViewCount: (claimId) => dispatch(doFetchViewCount(claimId)),
  doAnalyticsView: (uri) => dispatch(doAnalyticsView(uri)),
});

export default connect(select, perform)(FileViewCount);
