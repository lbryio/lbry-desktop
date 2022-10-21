// @flow
import React from 'react';

import * as ICONS from 'constants/icons';

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

  const [isBusy, setIsBusy] = React.useState();

  function handleGoBack() {
    doHideModal();
    // makes sense to open previous and continue only on confirm,
    // in case I give up, close/cancel will just abort
    if (previousModal) doOpenModal(previousModal, previousProps);
  }

  return (
    <Modal onAborted={isBusy ? undefined : doHideModal} isOpen type="card" className="modal--add-card">
      <Button button="link" className="padding-small" label={__('Go Back')} icon={ICONS.BACK} onClick={handleGoBack} />

      <Card
        title={hasSavedCard ? __('Card Details') : __('Add your Card')}
        body={<StripeCard setIsBusy={setIsBusy} isModal />}
        actions={
          <div className="section__actions">
            <Button button="primary" label={__('OK')} onClick={handleGoBack} disabled={isBusy || !hasSavedCard} />
            <Button button="link" label={__('Cancel')} onClick={doHideModal} disabled={isBusy} />
          </div>
        }
      />
    </Modal>
  );
};

export default ModalStripeCard;
