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
      <Modal
        isOpen
        contentLabel={__('Transaction failed')}
        title={__('Transaction Failed')}
        onConfirmed={closeModal}
      >
        <section className="card__content">
          <p>{__('Sorry about that. Contact help@lbry.io if you continue to have issues.')}</p>
        </section>
      </Modal>
    );
  }
}

export default ModalTransactionFailed;
