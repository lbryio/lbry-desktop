// @flow
import React from 'react';
import { Modal } from 'modal/modal';
import Button from 'component/button';
import { FormField } from 'component/common/form';

type Props = {
  closeModal: () => void,
};

const ModalReport = (props: Props) => {
  const { closeModal } = props;

  return (
    <Modal type="custom" isOpen contentLabel="Report Content" title={__('Report Content')}>
      <p>{__('Choose an option according to the violation')}</p>
      <p>
        <hr> </hr>
      </p>
      <React.Fragment>
        <FormField type="radio" name="Mistagged content" label={__('Mistagged Content')} />
        <FormField type="radio" name="Spam" label={__('Spam')} />
        <FormField type="radio" name="Illegal Promotions" label={__('Illegal Promotion')} />
        <FormField type="radio" name="Violent or repulsive" label={__('Violent or repulsive')} />
        <FormField type="radio" name="Child abuse" label={__('Child abuse')} />
        <FormField type="radio" name="Promotes Terrorism" label={__('Promotes Terrorism')} />
      </React.Fragment>
      <div className="card__actions">
        <Button button="primary" onClick={closeModal} label={__('Send')} />
        <Button button="alt" onClick={closeModal} label={__('Close')} />
      </div>
    </Modal>
  );
};

export default ModalReport;
