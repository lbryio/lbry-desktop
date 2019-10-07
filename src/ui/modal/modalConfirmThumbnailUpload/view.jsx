// @flow
import React from 'react';
import { Modal } from 'modal/modal';

type Props = {
  upload: WebFile => void,
  file: WebFile,
  closeModal: () => void,
  updatePublishForm: ({}) => void,
};

class ModalConfirmThumbnailUpload extends React.PureComponent<Props> {
  upload() {
    const { upload, updatePublishForm, closeModal, file } = this.props;
    upload(file);
    updatePublishForm({ thumbnailPath: file.path });
    closeModal();
  }

  render() {
    const { closeModal, file } = this.props;

    return (
      <Modal
        isOpen
        title={__('Upload Thumbnail')}
        contentLabel={__('Confirm Thumbnail Upload')}
        type="confirm"
        confirmButtonLabel={__('Upload')}
        onConfirmed={() => this.upload()}
        onAborted={closeModal}
      >
        <p>{__('Are you sure you want to upload this thumbnail to spee.ch')}?</p>

        <blockquote>{file.path || file.name}</blockquote>
      </Modal>
    );
  }
}

export default ModalConfirmThumbnailUpload;
