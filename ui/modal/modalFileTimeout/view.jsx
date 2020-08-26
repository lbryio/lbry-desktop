// @flow
import React from 'react';
import { Modal } from 'modal/modal';

type Props = {
  uri: string,
  metadata: StreamMetadata,
  closeModal: () => void,
};

class ModalFileTimeout extends React.PureComponent<Props> {
  render() {
    const {
      uri,
      metadata: { title },
      closeModal,
    } = this.props;

    return (
      <Modal isOpen title={__('Unable to download')} contentLabel={__('Download failed')} onConfirmed={closeModal}>
        <p className="error-modal__error-list">
          {__('LBRY was unable to download the stream')}:
          <div>
            <b>{title ? `"${title}"` : uri}</b>
          </div>
        </p>
      </Modal>
    );
  }
}

export default ModalFileTimeout;
