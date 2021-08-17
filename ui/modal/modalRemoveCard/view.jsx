// @flow
import React from 'react';
import { Modal } from 'modal/modal';
import Card from 'component/common/card';
import Button from 'component/button';
import * as ICONS from 'constants/icons';
import { Lbryio } from 'lbryinc';
import { getStripeEnvironment } from 'util/stripe';
let stripeEnvironment = getStripeEnvironment();

type Props = {
  closeModal: () => void,
  paymentMethodId: string,
  setAsConfirmingCard: () => void, // ?
};

export default function ModalRemoveCard(props: Props) {
  const { closeModal, paymentMethodId } = props;

  function removeCard() {
    Lbryio.call(
      'customer',
      'detach',
      {
        environment: stripeEnvironment,
        payment_method_id: paymentMethodId,
      },
      'post'
    ).then((removeCardResponse) => {
      // TODO: add toast here
      // closeModal();
      // Is there a better way to handle this? Why reload?
      window.location.reload();
    });
  }

  return (
    <Modal ariaHideApp={false} isOpen contentLabel={'hello'} type="card" onAborted={closeModal}>
      <Card
        title={__('Confirm Remove Card')}
        actions={
          <div className="section__actions">
            <Button
              className="stripe__confirm-remove-card"
              button="secondary"
              icon={ICONS.DELETE}
              label={__('Remove Card')}
              onClick={removeCard}
            />
            <Button button="link" label={__('Cancel')} onClick={closeModal} />
          </div>
        }
      />
    </Modal>
  );
}
