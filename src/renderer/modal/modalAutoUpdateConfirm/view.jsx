import React from 'react';
import { Modal } from 'modal/modal';
import { Line } from 'rc-progress';
import Link from 'component/link/index';

const { ipcRenderer } = require('electron');

class ModalAutoUpdateConfirm extends React.PureComponent {
  render() {
    const { closeModal, declineAutoUpdate } = this.props;

    return (
      <Modal
        isOpen={true}
        type="confirm"
        contentLabel={__('Update Downloaded')}
        confirmButtonLabel={__('Upgrade')}
        abortButtonLabel={__('Not now')}
        onConfirmed={() => {
          ipcRenderer.send('autoUpdateAccepted');
        }}
        onAborted={() => {
          declineAutoUpdate();
          closeModal();
        }}
      >
        <section>
          <h3 className="text-center">{__('LBRY Update Ready')}</h3>
          <p>{__('Your LBRY update is ready. Restart LBRY now to use it!')}</p>
          <p className="meta text-center">
            {__('Want to know what has changed?')} See the{' '}
            <Link label={__('release notes')} href="https://github.com/lbryio/lbry-app/releases" />.
          </p>
        </section>
      </Modal>
    );
  }
}

export default ModalAutoUpdateConfirm;
