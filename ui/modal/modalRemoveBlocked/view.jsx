// @flow
import React from 'react';
import { Modal } from 'modal/modal';
import I18nMessage from 'component/i18nMessage';

type Props = {
  blockedUri: string,
  closeModal: () => void,
  blockedChannels: Array<string>,
  toggleBlockChannel: (uri: string) => void,
};

function ModalRemoveBlocked(props: Props) {
  const { blockedUri, closeModal, blockedChannels, toggleBlockChannel } = props;

  function handleConfirm() {
    if (blockedUri && blockedChannels.includes(blockedUri)) {
      // DANGER: Always ensure the uri is actually in the list since we are using a
      // toggle function. If 'null' is accidentally toggled INTO the list, the app
      // won't start. Ideally, we should add a "removeBlockedChannel()", but with
      // the gating above, it should be safe/good enough.
      toggleBlockChannel(blockedUri);
    }

    closeModal();
  }

  return (
    <Modal
      isOpen
      type="confirm"
      title={__('Remove from blocked list')}
      confirmButtonLabel={__('Remove')}
      onConfirmed={handleConfirm}
      onAborted={() => closeModal()}
    >
      <em>{blockedUri}</em>
      <p />
      <p>
        <I18nMessage>Are you sure you want to remove this from the list?</I18nMessage>
      </p>
    </Modal>
  );
}

export default ModalRemoveBlocked;
