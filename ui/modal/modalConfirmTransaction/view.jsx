// @flow
import React from 'react';
import Button from 'component/button';
import { Form } from 'component/common/form';
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
        title={__('Send LBC')}
        contentLabel={__('Confirm Transaction')}
        type="custom"
        onAborted={closeModal}
      >
        <Form onSubmit={() => this.onConfirmed()}>
          <p>{__('Sending: ')}</p>
          <blockquote>{amount} LBC</blockquote>
          <p>{__('To address: ')}</p>
          <blockquote>{address}</blockquote>
          <p>{__('Once the transaction is sent, it cannot be reversed.')}</p>
          <div className="card__actions">
            <Button autoFocus button="primary" label={__('Send')} onClick={() => this.onConfirmed()} />
            <Button button="link" label={__('Cancel')} onClick={closeModal} />
          </div>
        </Form>
      </Modal>
    );
  }
}

export default ModalConfirmTransaction;
