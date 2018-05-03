import React from 'react';
import { Modal } from 'modal/modal';

class ModalFileTimeout extends React.PureComponent {
  render() {
    const {
      metadata: { title },
    } = this.props;

    return (
      <Modal isOpen contentLabel={__('Download failed')} onConfirmed={closeModal}>
        {__('LBRY was unable to download the stream')} <strong>{title}</strong>.
      </Modal>
    );
  }
}

export default ModalFileTimeout;
