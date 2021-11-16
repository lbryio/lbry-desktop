import { connect } from 'react-redux';
import { makeSelectClaimForUri, selectIsStreamPlaceholderForUri } from 'redux/selectors/claims';
import FileType from './view';

const select = (state, props) => ({
  claim: makeSelectClaimForUri(props.uri)(state),
  isLivestream: selectIsStreamPlaceholderForUri(state, props.uri),
});

export default connect(select)(FileType);
