// @flow
import React, { useState, useEffect } from 'react';
// @if TARGET='app'
import { ipcRenderer } from 'electron';
// @endif
import { Modal } from 'modal/modal';
import LastReleaseChanges from 'component/lastReleaseChanges';

type Props = {
  closeModal: (any) => any,
  declineAutoUpdate: () => any,
  errorWhileUpdating: boolean,
  isDownloading: boolean,
  isUpdateAvailable: boolean,
};

const ModalAutoUpdateDownloaded = (props: Props) => {
  const { closeModal, declineAutoUpdate, errorWhileUpdating, isDownloading, isUpdateAvailable } = props;
  const [waitingForAutoUpdateResponse, setWaitingForAutoUpdateResponse] = useState(false);

  const handleConfirm = () => {
    setWaitingForAutoUpdateResponse(true);
    ipcRenderer.send('autoUpdateAccepted');
  };

  const handleAbort = () => {
    declineAutoUpdate();
    closeModal();
  };

  useEffect(() => {
    setWaitingForAutoUpdateResponse(false);
  }, [errorWhileUpdating, isDownloading, isUpdateAvailable]);

  return (
    <Modal
      isOpen
      type="confirm"
      contentLabel={__('Upgrade Downloaded')}
      title={__('LBRY leveled up')}
      confirmButtonLabel={isDownloading ? __('Downloading...') : __('Upgrade Now')}
      abortButtonLabel={isDownloading ? __('Keep browsing') : __('Not Now')}
      confirmButtonDisabled={!isUpdateAvailable || isDownloading || waitingForAutoUpdateResponse}
      onConfirmed={handleConfirm}
      onAborted={handleAbort}
    >
      <LastReleaseChanges />
      {errorWhileUpdating && <p>{__('There was an error while updating. Please try again.')}</p>}
    </Modal>
  );
};

export default ModalAutoUpdateDownloaded;
