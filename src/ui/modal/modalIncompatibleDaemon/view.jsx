// @flow
import React from 'react';
import { Modal } from 'modal/modal';
import Button from 'component/button';

type Props = {
  onContinueAnyway: () => void,
  quitAnyDaemon: () => void,
};

class ModalIncompatibleDaemon extends React.PureComponent<Props> {
  render() {
    const { onContinueAnyway, quitAnyDaemon } = this.props;

    return (
      <Modal
        isOpen
        title={__('Incompatible Daemon')}
        contentLabel={__('Incompatible daemon running')}
        type="confirm"
        confirmButtonLabel={__('Close App and LBRY Processes')}
        abortButtonLabel={__('Continue Anyway')}
        onConfirmed={quitAnyDaemon}
        onAborted={onContinueAnyway}
      >
        <p>
          {__(
            'This app is running with an incompatible version of the LBRY protocol. You can still use it, but there may be issues. Re-run the installation package for best results.'
          )}{' '}
          <Button button="link" label={__('Learn more')} href="https://lbry.com/faq/incompatible-protocol-version" />.
        </p>
      </Modal>
    );
  }
}

export default ModalIncompatibleDaemon;
