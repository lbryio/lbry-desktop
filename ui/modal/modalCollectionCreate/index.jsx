// @flow
import React from 'react';
import CollectionCreate from './internal/collectionCreate';
import { Modal } from 'modal/modal';

type Props = {
  uri: string,
  doHideModal: () => void,
};

const ModalCollectionCreate = (props: Props) => {
  const { uri, doHideModal } = props;

  return (
    <Modal isOpen type="card" onAborted={doHideModal}>
      <CollectionCreate uri={uri} closeModal={doHideModal} />
    </Modal>
  );
};

export default ModalCollectionCreate;
