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
  const filters = React.useMemo(() => [{ name: 'Images', extensions: ['jpg', 'jpeg', 'png', 'gif', 'svg'] }]);

  return (
    <Modal isOpen type="card" onAborted={closeModal} contentLabel={title}>
      <SelectAsset
        filters={filters}
        type="openFile"
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
