import React, { useState, useEffect } from "react";
// @if TARGET='app'
// @ts-expect-error - TS2792 - Cannot find module 'electron'. Did you mean to set the 'moduleResolution' option to 'node', or to add aliases to the 'paths' option?
import { ipcRenderer } from "electron";
// @endif
import { Modal } from "modal/modal";
import LastReleaseChanges from "component/lastReleaseChanges";

type Props = {
  closeModal: (arg1?: any) => any;
  declineAutoUpdate: () => any;
  errorWhileUpdating: boolean;
  isDownloading: boolean;
  isUpdateAvailable: boolean;
};

const ModalAutoUpdateDownloaded = (props: Props) => {
  const { closeModal, declineAutoUpdate, errorWhileUpdating, isDownloading, isUpdateAvailable } = props;
  const [waitingForAutoUpdateResponse, setWaitingForAutoUpdateResponse] = useState(false);

  const handleConfirm = () => {
    setWaitingForAutoUpdateResponse(true);
    ipcRenderer.send("autoUpdateAccepted");
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
      // @ts-expect-error - TS2322 - Type '{ children: Element[]; isOpen: true; type: string; contentLabel: string; title: string; confirmButtonLabel: string; abortButtonLabel: string; confirmButtonDisabled: boolean; onConfirmed: () => void; onAborted: () => void; }' is not assignable to type 'IntrinsicAttributes & ModalProps'.
      isOpen
      type="confirm"
      contentLabel={__("Upgrade Downloaded")}
      title={__("LBRY leveled up")}
      confirmButtonLabel={isDownloading ? __("Downloading...") : __("Upgrade Now")}
      abortButtonLabel={isDownloading ? __("Keep browsing") : __("Not Now")}
      confirmButtonDisabled={!isUpdateAvailable || isDownloading || waitingForAutoUpdateResponse}
      onConfirmed={handleConfirm}
      onAborted={handleAbort}
    >
      {/* @ts-expect-error - TS2741 (ts-migration) */}
      <LastReleaseChanges />
      {errorWhileUpdating && <p>{__("There was an error while updating. Please try again.")}</p>}
    </Modal>
  );
};

export default ModalAutoUpdateDownloaded;
