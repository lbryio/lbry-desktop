// @flow
import React from 'react';
import ClaimCollectionAdd from './internal/claimCollectionAdd';
import { Modal } from 'modal/modal';

type Props = {
  uri: string,
  // -- redux --
  doHideModal: () => void,
};

const ModalClaimCollectionAdd = (props: Props) => {
  const { uri, doHideModal } = props;

  return (
    <Modal isOpen type="card" onAborted={doHideModal}>
      <ClaimCollectionAdd uri={uri} closeModal={doHideModal} />
    </Modal>
  );
};

export default ModalClaimCollectionAdd;
