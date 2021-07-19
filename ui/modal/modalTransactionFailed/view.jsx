// @flow
import React from 'react';
import { Modal } from 'modal/modal';
import { SITE_HELP_EMAIL } from 'config';

type Props = {
  closeModal: () => void,
};

class ModalTransactionFailed extends React.PureComponent<Props> {
  render() {
    const { closeModal } = this.props;

    return (
      <Modal isOpen contentLabel={__('Transaction failed')} title={__('Transaction failed')} onConfirmed={closeModal}>
        <p>
          {__("Try refreshing to fix the issue. If that doesn't work, email %SITE_HELP_EMAIL% for support.", {
            SITE_HELP_EMAIL,
          })}
        </p>
      </Modal>
    );
  }
}

export default ModalTransactionFailed;
