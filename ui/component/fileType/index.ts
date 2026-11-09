//@ts-nocheck
import {connect} from 'react-redux';
import { makeSelectMediaTypeForUri } from 'redux/selectors/file_info';
import FileType from './view';

const select = (state: unknown, props: unknown) => ({
  mediaType: makeSelectMediaTypeForUri(props.uri)(state),
});

export default connect(select)(FileType);
