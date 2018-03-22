import React from 'react';
import { Modal } from 'modal/modal';
import { Line } from 'rc-progress';
import Button from 'component/button';

const { ipcRenderer } = require('electron');

class ModalAutoUpdateDownloaded extends React.PureComponent {
  render() {
    const { closeModal, declineAutoUpdate } = this.props;

    return (
      <Modal
        isOpen={true}
        type="confirm"
        contentLabel={__('Update Downloaded')}
        confirmButtonLabel={__('Use it Now')}
        abortButtonLabel={__('Upgrade on Close')}
        onConfirmed={() => {
          ipcRenderer.send('autoUpdateAccepted');
        }}
        onAborted={() => {
          declineAutoUpdate();
          ipcRenderer.send('autoUpdateDeclined');
          closeModal();
        }}
      >
        <section>
          <h3 className="text-center">{__('LBRY Leveled Up')}</h3>
          <p>
            {__(
              'A new version of LBRY has been released, downloaded, and is ready for you to use pending a restart.'
            )}
          </p>
        </section>
      </Modal>
    );
  }
}

export default ModalAutoUpdateDownloaded;
