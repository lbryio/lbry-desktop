// @flow
import React from 'react';
import { Modal } from 'modal/modal';

type Props = {
  address: string,
  amount: number,
  closeModal: () => void,
  sendToAddress: (string, number) => void,
};

class ModalConfirmTransaction extends React.PureComponent<Props> {
  onConfirmed() {
    const { closeModal, sendToAddress, amount, address } = this.props;
    sendToAddress(address, amount);
    closeModal();
  }

  render() {
    const { amount, address, closeModal } = this.props;
    return (
      <Modal
        isOpen
        contentLabel={__('Confirm Transaction')}
        type="confirm"
        confirmButtonLabel={__('Continue')}
        onConfirmed={() => this.onConfirmed()}
        onAborted={closeModal}
      >
        <p>{__('Are you sure you want to ')}</p>
        <h1>
          {__('send ')} {amount} LBC
        </h1>
        <p>{__('Sending: ')}</p>
        <blockquote>{amount} LBC</blockquote>
        <p>{__('To address: ')}</p>
        <blockquote>{address}</blockquote>
        <p>{__('Once the transaction is sent, it cannot be reversed.')}</p>
      </Modal>
    );
  }
}

export default ModalConfirmTransaction;
