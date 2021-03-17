import { connect } from 'react-redux';
import { makeSelectMediaTypeForUri, makeSelectClaimHasSource } from 'lbry-redux';
import FileType from './view';

const select = (state, props) => ({
  mediaType: makeSelectMediaTypeForUri(props.uri)(state),
  isLivestream: !makeSelectClaimHasSource(props.uri)(state),
});

export default connect(select)(FileType);
