// @flow
import React from 'react';
import { Modal } from 'modal/modal';
import LastReleaseChanges from 'component/lastReleaseChanges';

const IS_MAC = navigator.userAgent.indexOf('Mac OS X') !== -1;

type Props = {
  downloadUpgrade: () => void,
  skipUpgrade: () => void,
  releaseVersion: string,
};

class ModalUpgrade extends React.PureComponent<Props> {
  render() {
    const { downloadUpgrade, skipUpgrade, releaseVersion } = this.props;

    return (
      <Modal
        className={IS_MAC ? '' : 'main-wrapper--scrollbar'}
        isOpen
        contentLabel={__('Upgrade available')}
        title={__('LBRY leveled up')}
        type="confirm"
        confirmButtonLabel={__('Upgrade')}
        abortButtonLabel={__('Skip')}
        onConfirmed={downloadUpgrade}
        onAborted={skipUpgrade}
      >
        {__('A new version %release_tag% of LBRY is ready for you.', { release_tag: releaseVersion })}
        <LastReleaseChanges hideReleaseVersion />
      </Modal>
    );
  }
}

export default ModalUpgrade;
