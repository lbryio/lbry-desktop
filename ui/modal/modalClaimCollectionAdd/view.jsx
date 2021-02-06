// @flow
import React from 'react';
import ClaimCollectionAdd from 'component/claimCollectionAdd';
import { Modal } from 'modal/modal';

type Props = {
  doHideModal: () => void,
  uri: string,
};

const ModalClaimCollectionAdd = (props: Props) => {
  const { doHideModal, uri } = props;
  return (
    <Modal isOpen type="card" onAborted={doHideModal}>
      <ClaimCollectionAdd uri={uri} closeModal={doHideModal} />
    </Modal>
  );
};
export default ModalClaimCollectionAdd;
