import { connect } from 'react-redux';
import { doOpenModal } from 'redux/actions/app';
import { doPublishResume, doUpdateUploadRemove } from 'redux/actions/publish';
import { selectCurrentUploads, selectUploadCount } from 'redux/selectors/publish';
import WebUploadList from './view';

const select = (state) => ({
  currentUploads: selectCurrentUploads(state),
  uploadCount: selectUploadCount(state),
});

const perform = {
  doPublishResume,
  doUpdateUploadRemove,
  doOpenModal,
};

export default connect(select, perform)(WebUploadList);
