import { connect } from 'react-redux';
import { makeSelectPublishFormValue, selectIsStillEditing } from 'redux/selectors/publish';
import PublishPage from './view';

const select = (state) => ({
  bid: makeSelectPublishFormValue('bid')(state),
  name: makeSelectPublishFormValue('name')(state),
  title: makeSelectPublishFormValue('title')(state),
  bidError: makeSelectPublishFormValue('bidError')(state),
  editingURI: makeSelectPublishFormValue('editingURI')(state),
  uploadThumbnailStatus: makeSelectPublishFormValue('uploadThumbnailStatus')(state),
  thumbnail: makeSelectPublishFormValue('thumbnail')(state),
  thumbnailError: makeSelectPublishFormValue('thumbnailError')(state),
  isStillEditing: selectIsStillEditing(state),
});

export default connect(select, null)(PublishPage);
