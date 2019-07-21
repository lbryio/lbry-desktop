// @flow
import React from 'react';
import { Modal } from 'modal/modal';
import Button from 'component/button';
import { ipcRenderer } from 'electron';

type Props = {
  closeModal: () => void,
  declineAutoUpdate: () => void,
};

class ModalAutoUpdateConfirm extends React.PureComponent<Props> {
  render() {
    const { closeModal, declineAutoUpdate } = this.props;

    return (
      <Modal
        isOpen
        type="confirm"
        contentLabel={__('Upgrade Downloaded')}
        title={__('LBRY Upgrade Ready')}
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
        <p>{__('Your LBRY upgrade is ready. Restart LBRY now to use it!')}</p>
        <p className="help">
          {__('Want to know what has changed?')} See the{' '}
          <Button button="link" label={__('release notes')} href="https://github.com/lbryio/lbry-desktop/releases" />.
        </p>
      </Modal>
    );
  }
}

export default ModalAutoUpdateConfirm;
