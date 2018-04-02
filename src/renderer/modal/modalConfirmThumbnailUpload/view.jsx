// @flow
import React from 'react';
import { Modal } from 'modal/modal';
import { FormField } from 'component/common/form';

type Props = {
  upload: (string, boolean) => void,
  path: string,
  nsfw: boolean,
  closeModal: () => void,
  updatePublishForm: any => void,
};

class ModalConfirmThumbnailUpload extends React.PureComponent<Props> {
  upload() {
    this.props.upload(this.props.path, this.props.nsfw);
    this.props.closeModal();
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
        <p>{`Confirm upload: ${path}`}</p>
        <FormField
          type="checkbox"
          name="content_is_mature"
          postfix={__('Mature audiences only')}
          checked={nsfw}
          onChange={event => updatePublishForm({ nsfw: event.target.checked })}
        />
      </Modal>
    );
  }
}

export default ModalConfirmThumbnailUpload;
