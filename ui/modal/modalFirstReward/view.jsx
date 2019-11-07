// @flow
import React from 'react';
import { Modal } from 'modal/modal';

type Props = {
  closeModal: () => void,
};

class ModalFirstReward extends React.PureComponent<Props> {
  render() {
    const { closeModal } = this.props;

    return (
      <Modal
        type="alert"
        isOpen
        contentLabel={__('Welcome to LBRY')}
        title={__('Your First Reward')}
        onConfirmed={closeModal}
      >
        <p>{__('You just earned your first reward!')}</p>
        <p>{__("This reward will show in your Wallet in the top right momentarily (if it hasn't already).")}</p>
        <p>
          {__(
            'These credits are used to compensate creators, to publish your own content, and to have say in how the network works.'
          )}
        </p>
        <p>{__('No need to understand it all just yet! Try watching or publishing something next.')}</p>
      </Modal>
    );
  }
}

export default ModalFirstReward;
