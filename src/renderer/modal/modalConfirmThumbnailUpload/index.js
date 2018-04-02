import { connect } from 'react-redux';
import { doCloseModal } from 'redux/actions/app';
import { doUploadThumbnail, doUpdatePublishForm } from 'redux/actions/publish';
import { selectPublishFormValues } from 'redux/selectors/publish';
import ModalConfirmThumbnailUpload from './view';

const select = state => {
  const publishState = selectPublishFormValues(state);
  return { nsfw: publishState.nsfw };
};

const perform = dispatch => ({
  closeModal: () => dispatch(doCloseModal()),
  upload: (path, nsfw = false) => dispatch(doUploadThumbnail(path, nsfw)),
  updatePublishForm: value => dispatch(doUpdatePublishForm(value)),
});

export default connect(select, perform)(ModalConfirmThumbnailUpload);
