// @flow
import React from 'react';
import { Form, FormRow, FormField } from 'component/common/form';
import { Modal } from 'modal/modal';
import Button from 'component/button';

type Props = {
  closeModal: () => void,
  unlockWallet: string => void,
  walletDecryptSucceded: boolean,
  updateWalletStatus: boolean,
};

class ModalWalletDecrypt extends React.PureComponent<Props> {
  state = {
    submitted: false, // Prior actions could be marked complete
  };

  submitDecryptForm() {
    this.setState({ submitted: true });
    this.props.decryptWallet();
  }

  componentDidUpdate() {
    const { props, state } = this;

    if (state.submitted && props.walletDecryptSucceded === true) {
      props.closeModal();
      props.updateWalletStatus();
    }
  }

  render() {
    const { closeModal, walletDecryptSucceded } = this.props;

    return (
      <Modal
        isOpen
        contentLabel={__('Decrypt Wallet')}
        type="confirm"
        confirmButtonLabel={__('Decrypt Wallet')}
        abortButtonLabel={__('Cancel')}
        onConfirmed={() => this.submitDecryptForm()}
        onAborted={closeModal}
      >
        <Form onSubmit={() => this.submitDecryptForm()}>
          {__(
            'Your wallet has been encrypted with a local password, performing this action will remove this password.'
          )}
          <div className="card__actions">
            <Button
              button="link"
              label={__('Learn more')}
              href="https://lbry.io/faq/wallet-encryption"
            />
          </div>
        </Form>
      </Modal>
    );
  }
}

export default ModalWalletDecrypt;
