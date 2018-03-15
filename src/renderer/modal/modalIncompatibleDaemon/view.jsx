// @flow

import React from 'react';
import { Modal } from 'modal/modal';
import Link from 'component/link/index';
import type { Dispatch } from 'src/renderer/redux/actions/shape_shift';

type Props = {
  quit: Dispatch,
  quitAnyDaemon: Dispatch,
};

class ModalIncompatibleDaemon extends React.PureComponent<Props> {
  render() {
    const { quit, quitAnyDaemon } = this.props;

    return (
      <Modal
        isOpen
        contentLabel={__('Incompatible daemon running')}
        type="alert"
        confirmButtonLabel={__('Quit daemon')}
        abortButtonLabel={__('Do nothing')}
        onConfirmed={quitAnyDaemon}
        onAborted={quit}
      >
        {__(
          'This browser is running with an incompatible version of the LBRY protocol and your install must be repaired. '
        )}
        <Link label={__('Learn more')} href="https://lbry.io/faq/incompatible-protocol-version" />
      </Modal>
    );
  }
}

export default ModalIncompatibleDaemon;
