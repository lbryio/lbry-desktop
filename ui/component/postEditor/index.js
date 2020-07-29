import { connect } from 'react-redux';
import { selectIsStillEditing, makeSelectPublishFormValue, doUpdatePublishForm } from 'lbry-redux';
import PostEditor from './view';

const select = (state, props) => ({
  filePath: makeSelectPublishFormValue('filePath')(state),
  fileText: makeSelectPublishFormValue('fileText')(state),
  isStillEditing: selectIsStillEditing(state),
});

const perform = dispatch => ({
  updatePublishForm: value => dispatch(doUpdatePublishForm(value)),
});

export default connect(select, perform)(PostEditor);
