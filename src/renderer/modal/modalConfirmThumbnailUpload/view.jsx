// @flow
import React from 'react';
import { Modal } from 'modal/modal';
import { FormField, FormRow } from 'component/common/form';

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
        contentLabel={__('Confirm Thumbnail Upload')}
        type="confirm"
        confirmButtonLabel={__('Upload')}
        onConfirmed={() => this.upload()}
        onAborted={closeModal}
      >
        <header className="card__header">
          <h2 className="card__title">{__('More Ways To Get LBRY Credits')}</h2>
          <p className="card__subtitle">
            {__('Are you sure you want to upload this thumbnail to spee.ch')}?
          </p>
        </header>

        <blockquote>{path}</blockquote>
        <FormRow>
          <FormField
            type="checkbox"
            name="content_is_mature"
            postfix={__('Mature audiences only')}
            checked={nsfw}
            onChange={event => updatePublishForm({ nsfw: event.target.checked })}
          />
        </FormRow>
      </Modal>
    );
  }
}

export default ModalConfirmThumbnailUpload;
