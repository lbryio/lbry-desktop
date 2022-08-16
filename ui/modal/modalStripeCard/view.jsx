// @flow
import React from 'react';

import { Modal } from 'modal/modal';

import Card from 'component/common/card';
import Button from 'component/button';
import StripeCard from 'component/settingsStripeCard';

type Props = {
  previousModal?: string, // in case this modal was called from another modal
  previousProps?: any,
  doHideModal: () => void,
  doOpenModal: (modalType: string, props?: any) => void,
};

const ModalStripeCard = (props: Props) => {
  const { previousModal, previousProps, doHideModal, doOpenModal } = props;

  function handleClose() {
    doHideModal();
    if (previousModal) doOpenModal(previousModal, previousProps);
  }

  return (
    <Modal onAborted={handleClose} isOpen type="card">
      <Card
        title={__('Add your Card')}
        body={<StripeCard />}
        actions={
          <div className="section__actions">
            <Button button="primary" label={__('OK')} onClick={handleClose} />

            <Button button="link" label={__('Cancel')} onClick={handleClose} />
          </div>
        }
      />
    </Modal>
  );
};

export default ModalStripeCard;
