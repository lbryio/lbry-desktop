// I"ll come back to This
/* esline-disable */
import React from 'react';
import { Modal } from 'modal/modal';
import CreditAmount from 'component/common/credit-amount';

class ModalFirstReward extends React.PureComponent {
  render() {
    const { closeModal } = this.props;

    return (
      <Modal
        type="alert"
        overlayClassName="modal-overlay modal-overlay--clear"
        isOpen
        contentLabel={__('Welcome to LBRY')}
        onConfirmed={closeModal}
      >
        <section>
          <h3 className="modal__header">{__('Your First Reward')}</h3>
          <p>{__('You just earned your first reward!')}</p>
          <p>
            {__(
              "This reward will show in your Wallet in the top right momentarily (if it hasn't already)."
            )}
          </p>
          <p>
            {__(
              'These credits are used to compensate creators, to publish your own content, and to have say in how the network works.'
            )}
          </p>
          <p>
            {__(
              'No need to understand it all just yet! Try watching or publishing something next.'
            )}
          </p>
        </section>
      </Modal>
    );
  }
}

export default ModalFirstReward;
/* eslint-enable */
