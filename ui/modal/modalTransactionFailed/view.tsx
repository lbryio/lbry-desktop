import React from 'react';
import { Modal } from 'modal/modal';
import { SITE_HELP_EMAIL } from 'config';

type Props = {
  closeModal: () => void
};

class ModalTransactionFailed extends React.PureComponent<Props> {
  render() {
    const { closeModal } = this.props;

    return (
// @ts-expect-error - TS2322 - Type '{ children: Element; isOpen: true; contentLabel: string; title: string; onConfirmed: () => void; }' is not assignable to type 'IntrinsicAttributes & ModalProps'.
      <Modal isOpen contentLabel={__('Transaction failed')} title={__('Transaction failed')} onConfirmed={closeModal}>
        <p>
          {__('Sorry about that. Contact %SITE_HELP_EMAIL% if you continue to have issues.', {
            SITE_HELP_EMAIL,
          })}
        </p>
      </Modal>
    );
  }
}

export default ModalTransactionFailed;
