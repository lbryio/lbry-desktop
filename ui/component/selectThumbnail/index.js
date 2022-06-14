import { connect } from 'react-redux';
import { selectPublishFormValues, selectMyClaimForUri } from 'redux/selectors/publish';
import { selectFileInfosByOutpoint } from 'redux/selectors/file_info';
import { doUpdatePublishForm, doResetThumbnailStatus } from 'redux/actions/publish';
import { doOpenModal } from 'redux/actions/app';
import PublishPage from './view';

const select = (state, props) => {
  const publishFormFields = selectPublishFormValues(state);
  return {
    ...publishFormFields,
    thumbnail: props.thumbnail || publishFormFields.thumbnail,
    fileInfos: selectFileInfosByOutpoint(state),
    myClaimForUri: selectMyClaimForUri(state),
  };
};

const perform = (dispatch) => ({
  updatePublishForm: (value) => dispatch(doUpdatePublishForm(value)),
  resetThumbnailStatus: () => dispatch(doResetThumbnailStatus()),
  openModal: (modal, props) => dispatch(doOpenModal(modal, props)),
});

export default connect(select, perform)(PublishPage);
