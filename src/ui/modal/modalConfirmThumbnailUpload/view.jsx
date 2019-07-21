// @flow
import React from 'react';
import { Modal } from 'modal/modal';

type Props = {
  upload: string => void,
  path: string,
  closeModal: () => void,
  updatePublishForm: ({}) => void,
};

class ModalConfirmThumbnailUpload extends React.PureComponent<Props> {
  upload() {
    const { upload, updatePublishForm, closeModal, path } = this.props;
    upload(path);
    updatePublishForm({ thumbnailPath: path });
    closeModal();
  }

  render() {
    const { closeModal, path } = this.props;

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

        <blockquote>{path}</blockquote>
      </Modal>
    );
  }
}

export default ModalConfirmThumbnailUpload;
