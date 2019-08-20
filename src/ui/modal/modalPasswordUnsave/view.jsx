// @flow
import React from 'react';
import { Modal } from 'modal/modal';
import keytar from 'keytar';

type Props = {
  closeModal: () => void,
  setPasswordSaved: boolean => void,
};

class ModalPasswordUnsave extends React.PureComponent<Props> {
  render() {
    return (
      <Modal
        isOpen
        contentLabel={__('Unsave Password')}
        title={__('Clear Saved Password')}
        type="confirm"
        confirmButtonLabel={__('Forget')}
        abortButtonLabel={__('Nevermind')}
        onConfirmed={() =>
          keytar.deletePassword('LBRY', 'wallet_password').then(() => {
            this.props.setPasswordSaved(false);
            this.props.closeModal();
          })
        }
        onAborted={this.props.closeModal}
      >
        <p>
          {__('You are about to delete your saved password.')}{' '}
          {__('Your wallet will still be encrypted, but you will have to remember and enter it manually on startup.')}
        </p>
      </Modal>
    );
  }
}

export default ModalPasswordUnsave;
