// @flow
import React from 'react';
import { Modal } from 'modal/modal';

type Props = {
  closeModal: () => void,
};

class ModalTransactionFailed extends React.PureComponent<Props> {
  render() {
    const { closeModal } = this.props;

    return (
      <Modal isOpen contentLabel={__('Transaction failed')} title={__('Transaction failed')} onConfirmed={closeModal}>
        <p>{__('Sorry about that. Contact help@odysee.com if you continue to have issues.')}</p>
      </Modal>
    );
  }
}

export default ModalTransactionFailed;
