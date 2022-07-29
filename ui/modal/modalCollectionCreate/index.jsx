// @flow
import React from 'react';
import CollectionCreate from './internal/collectionCreate';
import { Modal } from 'modal/modal';

type Props = {
  sourceId?: string,
  doHideModal: () => void,
};

const ModalCollectionCreate = (props: Props) => {
  const { sourceId, doHideModal } = props;

  return (
    <Modal isOpen type="card" onAborted={doHideModal}>
      <CollectionCreate sourceId={sourceId} closeModal={doHideModal} />
    </Modal>
  );
};

export default ModalCollectionCreate;
