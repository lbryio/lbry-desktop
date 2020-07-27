import { connect } from 'react-redux';
import {
  selectIsStillEditing,
  makeSelectPublishFormValue,
  doUpdatePublishForm,
  makeSelectFileInfoForUri,
} from 'lbry-redux';
import StoryEditor from './view';

const select = (state, props) => ({
  fileInfo: makeSelectFileInfoForUri(props.uri)(state),
  filePath: makeSelectPublishFormValue('filePath')(state),
  fileText: makeSelectPublishFormValue('fileText')(state),
  isStillEditing: selectIsStillEditing(state),
});

const perform = dispatch => ({
  updatePublishForm: value => dispatch(doUpdatePublishForm(value)),
});

export default connect(select, perform)(StoryEditor);
