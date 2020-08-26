// @flow
import React from 'react';
import { Modal } from 'modal/modal';
import { deleteSavedPassword } from 'util/saved-passwords';

type Props = {
  closeModal: () => void,
  callback?: () => void,
};

class ModalPasswordUnsave extends React.PureComponent<Props> {
  render() {
    return (
      <Modal
        isOpen
        contentLabel={__('Unsave Password')}
        title={__('Clear saved password')}
        type="confirm"
        confirmButtonLabel={__('Forget')}
        abortButtonLabel={__('Nevermind')}
        onConfirmed={() =>
          deleteSavedPassword().then(() => {
            this.props.closeModal();
            if (this.props.callback) {
              this.props.callback();
            }
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
