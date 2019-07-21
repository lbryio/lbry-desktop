// @flow
import React from 'react';
import { Modal } from 'modal/modal';

type Props = {
  closeModal: () => void,
  doAuth: () => void,
};

class ModalRewardApprovalRequired extends React.PureComponent<Props> {
  render() {
    const { closeModal, doAuth } = this.props;

    return (
      <Modal
        isOpen
        title={__('Hmm. Are you real?')}
        contentLabel={__('Human Verification Required')}
        onConfirmed={doAuth}
        onAborted={closeModal}
        type="confirm"
        confirmButtonLabel={__("I'm Totally Real")}
        abortButtonLabel={__('Never Mind')}
      >
        <p>
          {__(
            "Before we can give you any credits, we need to perform a brief check to make sure you're a new and unique person."
          )}
        </p>
      </Modal>
    );
  }
}

export default ModalRewardApprovalRequired;
