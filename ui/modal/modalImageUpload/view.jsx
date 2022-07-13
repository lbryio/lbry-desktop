// @flow
import React from 'react';
import { Modal } from 'modal/modal';
import SelectAsset from 'component/selectAsset';

type Props = {
  closeModal: () => void,
  currentValue: string,
  title: string,
  helpText: string,
  onUpdate: (string, boolean, ?string) => void,
  assetName: string,
};

function ModalImageUpload(props: Props) {
  const { closeModal, currentValue, title, assetName, helpText, onUpdate } = props;

  return (
    <Modal isOpen type="card" onAborted={closeModal} contentLabel={title}>
      <SelectAsset
        onUpdate={onUpdate}
        currentValue={currentValue}
        assetName={assetName}
        recommended={helpText}
        onDone={closeModal}
        buildImagePreview
      />
    </Modal>
  );
}

export default ModalImageUpload;
