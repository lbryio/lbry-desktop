// @flow
import React from 'react';
import { Modal } from 'modal/modal';
import WunderbarSuggestions from 'component/wunderbarSuggestions';

type Props = {
  closeModal: () => void,
};

export default function ModalMobileSearch(props: Props) {
  const { closeModal } = props;

  return (
    <Modal onAborted={closeModal} isOpen type="card">
      <WunderbarSuggestions isMobile />
    </Modal>
  );
}
