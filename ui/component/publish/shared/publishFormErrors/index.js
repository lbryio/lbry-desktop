import { connect } from 'react-redux';
import { selectPublishFormValue, selectIsStillEditing } from 'redux/selectors/publish';
import PublishFormErrors from './view';

const select = (state) => ({
  bid: selectPublishFormValue(state, 'bid'),
  name: selectPublishFormValue(state, 'name'),
  title: selectPublishFormValue(state, 'title'),
  bidError: selectPublishFormValue(state, 'bidError'),
  editingURI: selectPublishFormValue(state, 'editingURI'),
  uploadThumbnailStatus: selectPublishFormValue(state, 'uploadThumbnailStatus'),
  restrictedToMemberships: selectPublishFormValue(state, 'restrictedToMemberships'),
  thumbnail: selectPublishFormValue(state, 'thumbnail'),
  thumbnailError: selectPublishFormValue(state, 'thumbnailError'),
  isStillEditing: selectIsStillEditing(state),
});

export default connect(select)(PublishFormErrors);
