// @flow
import React from 'react';
import { Modal } from 'modal/modal';
import Button from 'component/button';
import { getSavedPassword, deleteSavedPassword } from 'util/saved-passwords';

type Props = {
  closeModal: () => void,
  decryptWallet: () => void,
  updateWalletStatus: () => void,
  walletDecryptSucceded: boolean,
  getSync: (?string) => void,
  syncEnabled: boolean,
  syncAndDecrypt: (?string, ?string, boolean) => void,
};

type State = {
  submitted: boolean,
};

class ModalWalletDecrypt extends React.PureComponent<Props, State> {
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
    const { decryptWallet, getSync, syncEnabled, syncAndDecrypt } = this.props;
    this.setState({ submitted: true });

    getSavedPassword().then(oldPassword => {
      if (syncEnabled) {
        return syncAndDecrypt(oldPassword, '', false)
          .then(() => getSync(''))
          .then(() => deleteSavedPassword());
      } else {
        decryptWallet();
        deleteSavedPassword();
      }
    });
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
        <p>
          {__(
            'Your wallet has been encrypted with a local password, performing this action will remove this password.'
          )}{' '}
          <Button button="link" label={__('Learn more')} href="https://lbry.com/faq/wallet-encryption" />.
        </p>
      </Modal>
    );
  }
}

export default ModalWalletDecrypt;
