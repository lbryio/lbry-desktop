import React from 'react';
import { Modal } from 'modal/modal';
import Lightbox from 'react-awesome-lightbox';
// @ts-expect-error - TS2882 (ts-migration)
import 'react-awesome-lightbox/build/style.css';

type Props = {
  src: string,
  title: string,
  closeModal: () => void
};

export default function ModalMobileSearch(props: Props) {
  const { src, title, closeModal } = props;

  return (
// @ts-expect-error - TS2322 - Type '{ children: Element; onAborted: () => void; isOpen: true; type: string; }' is not assignable to type 'IntrinsicAttributes & ModalProps'.
    <Modal onAborted={closeModal} isOpen type="custom">
      <Lightbox image={src} title={title} onClose={closeModal} />
    </Modal>
  );
}
