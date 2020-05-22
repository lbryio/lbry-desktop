// @flow
import React from 'react';
import { Modal } from 'modal/modal';
import Button from 'component/button';
import * as MODALS from 'constants/modal_types';

type Props = {
  closeModal: () => void,
  openModal: (id: string, { amount: number, address: string }) => void,
};

const ModalConfirmReport = (props: Props) => {
  const { closeModal, openModal } = props;

  const confirmReport = e => {
    e.preventDefault();
    openModal(MODALS.CONFIRM_TRANSACTION, { amount: 0.01, address: 'noAddressYet' });
  };

  return (
    <Modal type="custom" isOpen contentLabel="Confirm Report" title={__('Confirm Report')}>
      <p>
        <b>DISCLAIMER</b>: THE LBC YOU SEND IS A DEPOSIT AND WILL BE RETURNED TO YOU IF AND ONLY IF THE REPORT IS VALID.
      </p>

      <div className="card__actions">
        <Button button="primary" onClick={confirmReport} label={__('Confirm')} />
        <Button button="alt" onClick={closeModal} label={__('Cancel')} />
      </div>
    </Modal>
  );
};

export default ModalConfirmReport;
