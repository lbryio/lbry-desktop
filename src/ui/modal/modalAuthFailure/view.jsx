// @flow
import React from 'react';
import { Modal } from 'modal/modal';

type Props = {
  close: () => void,
};

class ModalAuthFailure extends React.PureComponent<Props> {
  render() {
    const { close } = this.props;

    return (
      <Modal
        isOpen
        contentLabel={__('Unable to Authenticate')}
        title={__('Authentication Failure')}
        type="confirm"
        confirmButtonLabel={__('Reload')}
        abortButtonLabel={__('Continue')}
        onConfirmed={() => {
          window.location.reload();
        }}
        onAborted={close}
      >
        <section className="card__content">
          <p>
            {__(
              'If reloading does not fix this, or you see this at every start up, please email help@lbry.com.'
            )}
          </p>
        </section>
      </Modal>
    );
  }
}

export default ModalAuthFailure;
