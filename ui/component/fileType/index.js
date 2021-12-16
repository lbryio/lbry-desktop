import { connect } from 'react-redux';
import { makeSelectMediaTypeForUri } from 'redux/selectors/file_info';
import { selectIsStreamPlaceholderForUri } from 'redux/selectors/claims';
import FileType from './view';

const select = (state, props) => ({
  mediaType: makeSelectMediaTypeForUri(props.uri)(state),
  isLivestream: selectIsStreamPlaceholderForUri(state, props.uri),
});

export default connect(select)(FileType);
