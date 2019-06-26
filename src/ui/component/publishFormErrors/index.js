import { connect } from 'react-redux';
import { makeSelectPublishFormValue, selectIsStillEditing } from 'redux/selectors/publish';
import PublishPage from './view';

const select = state => ({
  name: makeSelectPublishFormValue('name')(state),
  title: makeSelectPublishFormValue('title')(state),
  bid: makeSelectPublishFormValue('bid')(state),
  editingUri: makeSelectPublishFormValue('editingUri')(state),
  uploadThumbnailStatus: makeSelectPublishFormValue('uploadThumbnailStatus')(state),
  isStillEditing: selectIsStillEditing(state),
});

export default connect(
  select,
  null
)(PublishPage);
