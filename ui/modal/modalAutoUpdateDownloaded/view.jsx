// @flow
import React, { useState } from 'react';
// @if TARGET='app'
import { ipcRenderer } from 'electron';
// @endif
import { Modal } from 'modal/modal';
import LastReleaseChanges from 'component/lastReleaseChanges';

type Props = {
  closeModal: (any) => any,
  declineAutoUpdate: () => any,
  errorWhileUpdating: boolean,
};

const ModalAutoUpdateDownloaded = (props: Props) => {
  const { closeModal, declineAutoUpdate, errorWhileUpdating } = props;
  const [disabled, setDisabled] = useState(false);
  const isDownloading = disabled && !errorWhileUpdating;

  const handleConfirm = () => {
    setDisabled(true);
    ipcRenderer.send('autoUpdateAccepted');
  };

  const handleAbort = () => {
    declineAutoUpdate();
    closeModal();
  };

  return (
    <Modal
      isOpen
      type="confirm"
      contentLabel={__('Upgrade Downloaded')}
      title={__('LBRY leveled up')}
      confirmButtonLabel={isDownloading ? __('Downloading...') : __('Upgrade Now')}
      abortButtonLabel={__('Not Now')}
      confirmButtonDisabled={isDownloading}
      onConfirmed={handleConfirm}
      onAborted={handleAbort}
    >
      <LastReleaseChanges />
      {errorWhileUpdating && <p>{__('There was an error while updating. Please try again.')}</p>}
    </Modal>
  );
};

export default ModalAutoUpdateDownloaded;
