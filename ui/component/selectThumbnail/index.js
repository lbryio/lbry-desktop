import { connect } from 'react-redux';
import {
  selectPublishFormValues,
  selectMyClaimForUri,
  doUpdatePublishForm,
  selectFileInfosByOutpoint,
  doResetThumbnailStatus,
} from 'lbry-redux';
import { doOpenModal } from 'redux/actions/app';
import PublishPage from './view';

const select = (state) => ({
  ...selectPublishFormValues(state),
  fileInfos: selectFileInfosByOutpoint(state),
  myClaimForUri: selectMyClaimForUri(state),
});

const perform = (dispatch) => ({
  updatePublishForm: (value) => dispatch(doUpdatePublishForm(value)),
  resetThumbnailStatus: () => dispatch(doResetThumbnailStatus()),
  openModal: (modal, props) => dispatch(doOpenModal(modal, props)),
});

export default connect(select, perform)(PublishPage);
