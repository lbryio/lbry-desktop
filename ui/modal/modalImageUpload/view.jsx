// @flow
import React from 'react';
import { Modal } from 'modal/modal';
import Button from 'component/button';
import Card from 'component/common/card';
import SelectAsset from 'component/selectAsset';

type Props = {
  closeModal: () => void,
  currentValue: string,
  label: string,
  helptext: string,
  onUpdate: string => void,
};

const ModalImageUpload = (props: Props) => {
  const { closeModal, currentValue, label, helptext, onUpdate } = props;

  return (
    <Modal isOpen type="card" onAborted={closeModal}>
      <Card
        title={__(label)}
        body={
          <SelectAsset
            onUpdate={v => onUpdate(v)}
            currentValue={currentValue}
            assetName={label}
            recommended={__(helptext)}
          />
        }
        actions={
          <div className="card__actions">
            <Button button="primary" label={__('Done')} onClick={closeModal} />
          </div>
        }
      />
    </Modal>
  );
};

export default ModalImageUpload;
