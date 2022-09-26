import { connect } from 'react-redux';
import { doUpdatePublishForm } from 'redux/actions/publish';
import { selectIsStillEditing, selectPublishFormValue } from 'redux/selectors/publish';
import { selectStreamingUrlForUri } from 'redux/selectors/file_info';
import { doPlayUri } from 'redux/actions/content';
import PostEditor from './view';

const select = (state, props) => ({
  filePath: selectPublishFormValue(state, 'filePath'),
  fileText: selectPublishFormValue(state, 'fileText'),
  streamingUrl: selectStreamingUrlForUri(state, props.uri),
  isStillEditing: selectIsStillEditing(state),
});

const perform = (dispatch) => ({
  updatePublishForm: (value) => dispatch(doUpdatePublishForm(value)),
  fetchStreamingUrl: (uri) => dispatch(doPlayUri(uri)),
});

export default connect(select, perform)(PostEditor);
