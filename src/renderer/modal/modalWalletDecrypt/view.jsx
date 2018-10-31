// @flow
import React from 'react';
import { Form } from 'component/common/form';
import { Modal } from 'modal/modal';
import Button from 'component/button';

type Props = {
  closeModal: () => void,
  decryptWallet: () => void,
  walletDecryptSucceded: boolean,
  updateWalletStatus: boolean,
};

class ModalWalletDecrypt extends React.PureComponent<Props> {
  state = {
    submitted: false, // Prior actions could be marked complete
  };

  componentDidUpdate() {
    const { props, state } = this;

    if (state.submitted && props.walletDecryptSucceded === true) {
      props.closeModal();
      props.updateWalletStatus();
    }
  }

  submitDecryptForm() {
    this.setState({ submitted: true });
    this.props.decryptWallet();
  }

  render() {
    const { closeModal } = this.props;

    return (
      <Modal
        isOpen
        title={__('Decrypt Wallet')}
        contentLabel={__('Decrypt Wallet')}
        type="confirm"
        confirmButtonLabel={__('Decrypt Wallet')}
        abortButtonLabel={__('Cancel')}
        onConfirmed={() => this.submitDecryptForm()}
        onAborted={closeModal}
      >
        <section className="card__content">
          <Form onSubmit={() => this.submitDecryptForm()}>
            <p>
              {__(
                'Your wallet has been encrypted with a local password, performing this action will remove this password.'
              )}
            </p>
            <div className="card__actions">
              <Button
                button="link"
                label={__('Learn more')}
                href="https://lbry.io/faq/wallet-encryption"
              />
            </div>
          </Form>
        </section>
      </Modal>
    );
  }
}

export default ModalWalletDecrypt;
