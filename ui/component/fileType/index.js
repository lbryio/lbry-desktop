import { connect } from 'react-redux';
import { makeSelectMediaTypeForUri } from 'redux/selectors/file_info';
import FileType from './view';

const select = (state, props) => ({
  mediaType: makeSelectMediaTypeForUri(props.uri)(state),
});

export default connect(select)(FileType);
