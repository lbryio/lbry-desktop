// @flow
import React from 'react';
import { Modal } from 'modal/modal';
import LastReleaseChanges from 'component/lastReleaseChanges';

type Props = {
  downloadUpgrade: () => void,
  skipUpgrade: () => void,
};

class ModalUpgrade extends React.PureComponent<Props> {
  render() {
    const { downloadUpgrade, skipUpgrade } = this.props;

    return (
      <Modal
        isOpen
        contentLabel={__('Upgrade available')}
        title={__('LBRY leveled up')}
        type="confirm"
        confirmButtonLabel={__('Upgrade')}
        abortButtonLabel={__('Skip')}
        onConfirmed={downloadUpgrade}
        onAborted={skipUpgrade}
      >
        <p>
          {__('An updated version of LBRY is now available.')}{' '}
          {__('Your version is out of date and may be unreliable or insecure.')}
        </p>
        <LastReleaseChanges hideReleaseVersion />
      </Modal>
    );
  }
}

export default ModalUpgrade;
