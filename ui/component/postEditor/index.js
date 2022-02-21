import { connect } from 'react-redux';
import { doUpdatePublishForm } from 'redux/actions/publish';
import { selectIsStillEditing, makeSelectPublishFormValue } from 'redux/selectors/publish';
import { makeSelectStreamingUrlForUri } from 'redux/selectors/file_info';
import { doPlayUri } from 'redux/actions/content';
import PostEditor from './view';

const select = (state, props) => ({
  filePath: makeSelectPublishFormValue('filePath')(state),
  fileText: makeSelectPublishFormValue('fileText')(state),
  streamingUrl: makeSelectStreamingUrlForUri(props.uri)(state),
  isStillEditing: selectIsStillEditing(state),
});

const perform = (dispatch) => ({
  updatePublishForm: (value) => dispatch(doUpdatePublishForm(value)),
  fetchStreamingUrl: (uri) => dispatch(doPlayUri(uri)),
});

export default connect(select, perform)(PostEditor);
