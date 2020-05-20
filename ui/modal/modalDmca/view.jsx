// @flow
import React from 'react';
import { Modal } from 'modal/modal';
import Button from 'component/button';

type Props = {
  closeModal: () => void,
};

const ModalDmca = (props: Props) => {
  const { closeModal } = props;

  const confirmReport = e => {
    e.preventDefault();

    closeModal();
  };

  return (
    <Modal type="custom" isOpen contentLabel="DMCA Report" title={__('DMCA Report')}>
      <div className="card__actions">
        <Button button="primary" onClick={confirmReport} label={__('Report')} />
        <Button button="alt" onClick={closeModal} label={__('Close')} />
      </div>
    </Modal>
  );
};

export default ModalDmca;
