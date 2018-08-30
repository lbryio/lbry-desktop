import { connect } from 'react-redux';
import { doResolveUri } from 'lbry-redux';
import UserHistoryItem from './view';

const perform = (dispatch) => ({
  resolveUri: uri => dispatch(doResolveUri(uri)),
})

export default connect(null, perform)(UserHistoryItem);