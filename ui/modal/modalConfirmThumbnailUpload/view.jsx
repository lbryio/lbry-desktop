// @flow
import React from 'react';
import { Modal } from 'modal/modal';
import { DOMAIN } from 'config';

type Props = {
  file: WebFile,
  upload: (WebFile, (string) => void) => void,
  cb: (string) => void,
  closeModal: () => void,
  updatePublishForm: ({}) => void,
};

class ModalConfirmThumbnailUpload extends React.PureComponent<Props> {
  upload() {
    const { upload, updatePublishForm, cb, closeModal, file } = this.props;
    if (file) {
      upload(file, cb);
      updatePublishForm({ thumbnailPath: file.path });
      closeModal();
    }
  }

  render() {
    const { closeModal, file } = this.props;
    const filePath = file && (file.path || file.name);

    return (
      <Modal
        isOpen
        title={__('Upload thumbnail')}
        contentLabel={__('Confirm Thumbnail Upload')}
        type="confirm"
        confirmButtonLabel={__('Upload')}
        onConfirmed={() => this.upload()}
        onAborted={closeModal}
      >
        <label>{__('Are you sure you want to upload this thumbnail to %domain%', { domain: DOMAIN })}?</label>

        <blockquote>{filePath}</blockquote>
      </Modal>
    );
  }
}

export default ModalConfirmThumbnailUpload;
