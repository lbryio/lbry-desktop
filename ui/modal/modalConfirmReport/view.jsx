// @flow
import React from 'react';
import { Modal } from 'modal/modal';
import Button from 'component/button';
import * as MODALS from 'constants/modal_types';

type Props = {
  closeModal: () => void,
  openModal: (id: string, { amount: number, address: string }) => void,
  reportFields: {
    walletAddress: string,
  },
};

const ModalConfirmReport = (props: Props) => {
  const { closeModal, openModal, reportFields } = props;

  const confirmReport = e => {
    e.preventDefault();
    openModal(MODALS.CONFIRM_TRANSACTION, { amount: 0.01, address: 'noAddressYet' });
  };

  return (
    <Modal type="custom" isOpen contentLabel="Confirm Report" title={__('Confirm Report')}>
      <p>
        <b>DISCLAIMER</b>: YOU WILL HAVE TO SEND LBRY INC. A CERTAIN AMOUNT OF LBC AS A DEPOSIT AND WILL BE REFUNDED TO
        YOU IF AND ONLY IF THE REPORT IS VALID. WE USE THIS MEASURE TO PREVENT BOTS AND PEOPLE FROM ABUSING REPORT
        FORMS.
      </p>
      <p>The refund will be received on the following wallet address:</p>
      <blockquote>{reportFields.walletAddress}</blockquote>

      <div className="card__actions">
        <Button button="primary" onClick={confirmReport} label={__('Confirm')} />
        <Button button="alt" onClick={closeModal} label={__('Cancel')} />
      </div>
    </Modal>
  );
};

export default ModalConfirmReport;
