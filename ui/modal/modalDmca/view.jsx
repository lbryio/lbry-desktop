// @flow
import React from 'react';
import { Modal } from 'modal/modal';
import Button from 'component/button';
import { FormField } from 'component/common/form';

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
    <Modal
      type="custom"
      isOpen
      contentLabel="Copyright Infringement Report"
      title={__('Copyright Infringement Report')}
    >
      <br />
      <hr />
      <br />
      <React.Fragment>
        <FormField />
      </React.Fragment>
      <div className="card__actions">
        <Button button="primary" onClick={confirmReport} label={__('Report')} />
        <Button button="alt" onClick={closeModal} label={__('Close')} />
      </div>
    </Modal>
  );
};

export default ModalDmca;
