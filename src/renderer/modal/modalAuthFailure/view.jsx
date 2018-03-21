import React from 'react';
import { Modal } from 'modal/modal';

class ModalAuthFailure extends React.PureComponent {
  render() {
    const { close } = this.props;

    return (
      <Modal
        isOpen
        contentLabel={__('Unable to Authenticate')}
        type="confirm"
        confirmButtonLabel={__('Reload')}
        abortButtonLabel={__('Continue')}
        onConfirmed={() => {
          window.location.reload();
        }}
        onAborted={close}
      >
        <h3>{__('Authentication Failure')}</h3>
        <p>
          {__(
            'If reloading does not fix this, or you see this at every start up, please email help@lbry.io.'
          )}
        </p>
      </Modal>
    );
  }
}

export default ModalAuthFailure;
