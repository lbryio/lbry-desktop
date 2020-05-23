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
        <b>DISCLAIMER</b>:{' '}
      </p>
      <br />
      <hr />
      <p>
        {' '}
        A minimal amount of LBC will be sent to LBRY Inc as a deposit. If your report is valid, You will get a{' '}
        <b>FULL RETURN</b>. This validation is necessary for preventing Bots and Report Abuse.
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
