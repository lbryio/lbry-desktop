import { connect } from 'react-redux';
import { doResolveUri, makeSelectClaimForUri } from 'lbry-redux';
import UserHistoryItem from './view';

const select = (state, props) => ({
  claim: makeSelectClaimForUri(props.uri)(state),
});

const perform = dispatch => ({
  resolveUri: uri => dispatch(doResolveUri(uri)),
});

export default connect(
  select,
  perform
)(UserHistoryItem);
