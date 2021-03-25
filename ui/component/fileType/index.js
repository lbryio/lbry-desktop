import { connect } from 'react-redux';
import { makeSelectMediaTypeForUri, makeSelectClaimIsStreamPlaceholder } from 'lbry-redux';
import FileType from './view';

const select = (state, props) => ({
  mediaType: makeSelectMediaTypeForUri(props.uri)(state),
  isLivestream: makeSelectClaimIsStreamPlaceholder(props.uri)(state),
});

export default connect(select)(FileType);
