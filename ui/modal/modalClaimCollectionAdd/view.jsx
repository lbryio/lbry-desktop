// @flow
import React from 'react';
import ClaimCollectionAdd from 'component/claimCollectionAdd';
import { Modal } from 'modal/modal';

type Props = {
  doHideModal: () => void,
  uri: string,
  collectionId: string,
};

const ModalClaimCollectionAdd = (props: Props) => {
  const { doHideModal, uri, collectionId } = props;
  return (
    <Modal isOpen type="card" onAborted={doHideModal}>
      <ClaimCollectionAdd uri={uri} closeModal={doHideModal} collectionId={collectionId} />
    </Modal>
  );
};
export default ModalClaimCollectionAdd;
