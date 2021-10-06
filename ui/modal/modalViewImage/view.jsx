// @flow
import React from 'react';
import { Modal } from 'modal/modal';
import Lightbox from 'react-awesome-lightbox';
import 'react-awesome-lightbox/build/style.css';

type Props = {
  src: string,
  title: String,
  closeModal: () => void,
};

export default function ModalMobileSearch(props: Props) {
  const { src, title, closeModal } = props;

  return (
    <Modal onAborted={closeModal} isOpen type="custom">
      <Lightbox image={src} title={title} onClose={closeModal} />
    </Modal>
  );
}
