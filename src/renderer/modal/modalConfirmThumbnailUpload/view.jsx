// @flow
import React from 'react';
import { Modal } from 'modal/modal';
import { FormField } from 'component/common/form';

type Props = {
  upload: (string, boolean) => void,
  path: string,
  nsfw: boolean,
  closeModal: () => void,
  updatePublishForm: ({}) => void,
};

class ModalConfirmThumbnailUpload extends React.PureComponent<Props> {
  upload() {
    const { upload, updatePublishForm, closeModal, path, nsfw } = this.props;
    upload(path, nsfw);
    updatePublishForm({ thumbnailPath: path });
    closeModal();
  }

  render() {
    const { closeModal, path, updatePublishForm, nsfw } = this.props;

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
        <section className="card__content">
          <p>{__('Are you sure you want to upload this thumbnail to spee.ch')}?</p>

          <blockquote>{path}</blockquote>

          <FormField
            type="checkbox"
            name="content_is_mature"
            label={__('For mature audiences only')}
            checked={nsfw}
            onChange={event => updatePublishForm({ nsfw: event.target.checked })}
          />
        </section>
      </Modal>
    );
  }
}

export default ModalConfirmThumbnailUpload;
