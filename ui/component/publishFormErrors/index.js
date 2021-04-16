import { connect } from 'react-redux';
import { makeSelectPublishFormValue, selectIsStillEditing } from 'lbry-redux';
import PublishPage from './view';

const select = (state) => ({
  bid: makeSelectPublishFormValue('bid')(state),
  name: makeSelectPublishFormValue('name')(state),
  title: makeSelectPublishFormValue('title')(state),
  bidError: makeSelectPublishFormValue('bidError')(state),
  editingURI: makeSelectPublishFormValue('editingURI')(state),
  uploadThumbnailStatus: makeSelectPublishFormValue('uploadThumbnailStatus')(state),
  thumbnail: makeSelectPublishFormValue('thumbnail_url')(state),
  isStillEditing: selectIsStillEditing(state),
});

export default connect(select, null)(PublishPage);
