import React from 'react';
import { Modal } from 'modal/modal';
import { Line } from 'rc-progress';
import Button from 'component/button';

const { ipcRenderer } = require('electron');

class ModalAutoUpdateConfirm extends React.PureComponent {
  render() {
    const { closeModal, declineAutoUpdate } = this.props;

    return (
      <Modal
        isOpen
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
            <Button
              button="link"
              label={__('release notes')}
              href="https://github.com/lbryio/lbry-desktop/releases"
            />.
          </p>
        </section>
      </Modal>
    );
  }
}

export default ModalAutoUpdateConfirm;
