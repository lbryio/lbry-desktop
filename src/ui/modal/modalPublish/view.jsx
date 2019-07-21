// @flow
import React from 'react';
import { Modal } from 'modal/modal';

type Props = {
  closeModal: () => void,
  clearPublish: () => void,
  navigate: string => void,
  uri: string,
  isEdit: boolean,
};

class ModalPublishSuccess extends React.PureComponent<Props> {
  render() {
    const { closeModal, clearPublish, navigate, uri, isEdit } = this.props;
    const contentLabel = isEdit ? 'Updates published' : 'File published';
    const publishMessage = isEdit ? 'updates have been' : 'file has been';
    const publishType = isEdit ? 'updates' : 'file';

    return (
      <Modal
        isOpen
        title={__('Success')}
        contentLabel={__(contentLabel)}
        onConfirmed={() => {
          clearPublish();
          navigate('/$/published');
          closeModal();
        }}
      >
        <p>{__(`Your ${publishMessage} published to LBRY at the address`)}</p>
        <blockquote>{uri}</blockquote>
        <p>
          {__(
            `The ${publishType} will take a few minutes to appear for other LBRY users. Until then it will be listed as "pending" under your published files.`
          )}
        </p>
      </Modal>
    );
  }
}

export default ModalPublishSuccess;
