// @flow
import React, { useState } from 'react';
import { Modal } from 'modal/modal';
import { FormField } from 'component/common/form';
import * as txnTypes from 'constants/transaction_types';
import Card from 'component/common/card';
import Button from 'component/button';
import I18nMessage from 'component/i18nMessage';
import LbcSymbol from 'component/common/lbc-symbol';
import * as ICONS from 'constants/icons';
import { Lbryio } from 'lbryinc';
import { STRIPE_PUBLIC_KEY } from 'config';


let stripeEnvironment = 'test';
// if the key contains pk_live it's a live key
// update the environment for the calls to the backend to indicate which environment to hit
if (STRIPE_PUBLIC_KEY.indexOf('pk_live') > -1) {
  stripeEnvironment = 'live';
}


type Props = {
  closeModal: () => void,
  abandonTxo: (Txo, () => void) => void,
  abandonClaim: (string, number, ?() => void) => void,
  tx: Txo,
  claim: GenericClaim,
  cb: () => void,
  doResolveUri: (string) => void,
  uri: string,
};

export default function ModalRevokeClaim(props: Props) {

  var that = this;
  console.log(that);

  console.log(props);

  const { closeModal, uri, paymentMethodId } = props;

  console.log(uri);

  function removeCard(){
    console.log(paymentMethodId);

    Lbryio.call(
      'customer',
      'detach',
      {
        environment: stripeEnvironment,
        payment_method_id: paymentMethodId
      },
      'post'
    ).then((removeCardResponse) => {
      console.log(removeCardResponse)

      //TODO: add toast here
      closeModal();
    });
  }

  return (
    <Modal isOpen contentLabel={'hello'} type="card" onAborted={closeModal}>
      <Card
        title={'Confirm Remove Card'}
        // body={getMsgBody(type, isSupport, name)}
        actions={
          <div className="section__actions">
            <Button
              className="stripe__confirm-remove-card"
              button="secondary"
              icon={ICONS.DELETE}
              label={'Remove Card'}
              onClick={removeCard}
            />
            <Button button="link" label={__('Cancel')} onClick={closeModal} />
          </div>
        }
      />
    </Modal>
  );
}
