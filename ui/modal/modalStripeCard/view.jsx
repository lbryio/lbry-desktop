// @flow
import React from 'react';

import { Modal } from 'modal/modal';

import Card from 'component/common/card';
import Button from 'component/button';
import StripeCard from 'component/settingsStripeCard';

type Props = {
  previousModal?: string, // in case this modal was called from another modal
  previousProps?: any,
  // -- redux --
  hasSavedCard: boolean,
  doHideModal: () => void,
  doOpenModal: (modalType: string, props?: any) => void,
};

const ModalStripeCard = (props: Props) => {
  const { previousModal, previousProps, hasSavedCard, doHideModal, doOpenModal } = props;

  function handleConfirm() {
    doHideModal();
    // makes sense to open previous and continue only on confirm,
    // in case I give up, close/cancel will just abort
    if (previousModal) doOpenModal(previousModal, previousProps);
  }

  return (
    <Modal onAborted={doHideModal} isOpen type="card">
      <Card
        title={__('Add your Card')}
        body={<StripeCard />}
        actions={
          <div className="section__actions">
            <Button button="primary" label={__('OK')} onClick={handleConfirm} disabled={!hasSavedCard} />
            <Button button="link" label={__('Cancel')} onClick={doHideModal} />
          </div>
        }
      />
    </Modal>
  );
};

export default ModalStripeCard;
