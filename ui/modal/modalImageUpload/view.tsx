import React from 'react';
import { Modal } from 'modal/modal';
import SelectAsset from 'component/selectAsset';

type Props = {
  closeModal: () => void,
  currentValue: string,
  title: string,
  helpText: string,
  onUpdate: (arg1: string, arg2: boolean, arg3?: string | null | undefined) => void,
  assetName: string
};

function ModalImageUpload(props: Props) {
  const { closeModal, currentValue, title, assetName, helpText, onUpdate } = props;
// @ts-expect-error - TS2554 - Expected 2 arguments, but got 1.
  const filters = React.useMemo(() => [{ name: 'Images', extensions: ['jpg', 'jpeg', 'png', 'gif', 'svg'] }]);

  return (
// @ts-expect-error - TS2322 - Type '{ children: Element; isOpen: true; type: string; onAborted: () => void; contentLabel: string; }' is not assignable to type 'IntrinsicAttributes & ModalProps'.
    <Modal isOpen type="card" onAborted={closeModal} contentLabel={title}>
      <SelectAsset
        // @ts-expect-error - TS2322 (ts-migration)
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
