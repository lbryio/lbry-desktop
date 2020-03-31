import { connect } from 'react-redux';
import { doFetchViewCount, makeSelectViewCountForUri } from 'lbryinc';
import FileViewCount from './view';
import { makeSelectClaimForUri } from 'lbry-redux';

const select = (state, props) => ({
  claim: makeSelectClaimForUri(props.uri)(state),
  viewCount: makeSelectViewCountForUri(props.uri)(state),
});

const perform = dispatch => ({
  fetchViewCount: claimId => dispatch(doFetchViewCount(claimId)),
});

export default connect(select, perform)(FileViewCount);
