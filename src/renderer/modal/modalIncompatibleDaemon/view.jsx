import React from 'react';
import { Modal } from 'modal/modal';
import Button from 'component/button';

class ModalIncompatibleDaemon extends React.PureComponent {
  render() {
    const { quit, quitAnyDaemon } = this.props;

    return (
      <Modal
        isOpen
        contentLabel={__('Incompatible daemon running')}
        type="confirm"
        confirmButtonLabel={__('Quit daemon')}
        abortButtonLabel={__('Do nothing')}
        onConfirmed={quitAnyDaemon}
        onAborted={quit}
      >
        {__(
          'This browser is running with an incompatible version of the LBRY protocol and your install must be repaired. '
        )}
        <Button label={__('Learn more')} href="https://lbry.io/faq/incompatible-protocol-version" />
      </Modal>
    );
  }
}

export default ModalIncompatibleDaemon;
