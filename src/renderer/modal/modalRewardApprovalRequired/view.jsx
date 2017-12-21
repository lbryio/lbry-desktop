import React from 'react';
import { Modal } from 'modal/modal';

class ModalRewardApprovalRequired extends React.PureComponent {
  render() {
    const { closeModal, doAuth } = this.props;

    return (
      <Modal
        isOpen
        contentLabel={__('Human Verification Required')}
        onConfirmed={doAuth}
        onAborted={closeModal}
        type="confirm"
        confirmButtonLabel={__("I'm Totally Real")}
        abortButtonLabel={__('Never Mind')}
      >
        <section>
          <h3 className="modal__header">{__('This is awkward. Are you real?')}</h3>
          <p>
            {__(
              "Before we can give you any credits, we need to perform a brief check to make sure you're a new and unique person."
            )}
          </p>
        </section>
      </Modal>
    );
  }
}

export default ModalRewardApprovalRequired;
