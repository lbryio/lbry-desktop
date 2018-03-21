import React from 'react';
import { Modal } from 'modal/modal';
import Link from 'component/link';

class ModalUpgrade extends React.PureComponent {
  render() {
    const { downloadUpgrade, skipUpgrade } = this.props;

    return (
      <Modal
        isOpen
        contentLabel={__('Upgrade available')}
        type="confirm"
        confirmButtonLabel={__('Upgrade')}
        abortButtonLabel={__('Skip')}
        onConfirmed={downloadUpgrade}
        onAborted={skipUpgrade}
      >
        <h3 className="text-center">{__('LBRY Leveled Up')}</h3>
        <br />
        <p>
          {__('An updated version of LBRY is now available.')}{' '}
          {__('Your version is out of date and may be unreliable or insecure.')}
        </p>
        <p className="meta text-center">
          {__('Want to know what has changed?')} See the{' '}
          <Link label={__('release notes')} href="https://github.com/lbryio/lbry-app/releases" />.
        </p>
      </Modal>
    );
  }
}

export default ModalUpgrade;
