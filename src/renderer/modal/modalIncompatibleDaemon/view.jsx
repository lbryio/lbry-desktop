// @flow
import React from 'react';
import { Modal } from 'modal/modal';
import Button from 'component/button';

type Props = {
  quit: () => void,
  quitAnyDaemon: () => void,
};

class ModalIncompatibleDaemon extends React.PureComponent<Props> {
  render() {
    const { quit, quitAnyDaemon } = this.props;

    return (
      <Modal
        isOpen
        title={__('Incompatible Daemon')}
        contentLabel={__('Incompatible daemon running')}
        type="confirm"
        confirmButtonLabel={__('Close LBRY and daemon')}
        abortButtonLabel={__('Do nothing')}
        onConfirmed={quitAnyDaemon}
        onAborted={quit}
      >
        <p>
          {__(
            'This browser is running with an incompatible version of the LBRY protocol, please close the LBRY app and rerun the installation package to repair it. '
          )}
        </p>
        <Button
          button="link"
          label={__('Learn more')}
          href="https://lbry.io/faq/incompatible-protocol-version"
        />
      </Modal>
    );
  }
}

export default ModalIncompatibleDaemon;
