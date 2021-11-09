import { connect } from 'react-redux';
import { makeSelectMediaTypeForUri } from 'redux/selectors/file_info';
import { makeSelectClaimIsStreamPlaceholder } from 'redux/selectors/claims';
import FileType from './view';

const select = (state, props) => ({
  mediaType: makeSelectMediaTypeForUri(props.uri)(state),
  isLivestream: makeSelectClaimIsStreamPlaceholder(props.uri)(state),
});

export default connect(select)(FileType);
