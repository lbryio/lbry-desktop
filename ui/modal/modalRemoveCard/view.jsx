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

console.log('running here!');


type Props = {
  closeModal: () => void,
  abandonTxo: (Txo, () => void) => void,
  abandonClaim: (string, number, ?() => void) => void,
  tx: Txo,
  claim: GenericClaim,
  cb: () => void,
  doResolveUri: (string) => void,
};

export default function ModalRevokeClaim(props: Props) {
  var that = this;
  console.log(that);

  console.log(props);

  const { tx, claim, closeModal, abandonTxo, abandonClaim, cb, doResolveUri } = props;
  const [channelName, setChannelName] = useState('');

  React.useEffect(() => {
    if (claim) {
      doResolveUri(claim.permanent_url);
    }
  }, [claim, doResolveUri]);

  function getButtonLabel(type: string, isSupport: boolean) {
    if (isSupport && type === txnTypes.SUPPORT) {
      return __('Confirm Support Removal');
    } else if (type === txnTypes.SUPPORT) {
      return __('Confirm Tip Unlock');
    } else if (type === txnTypes.CHANNEL) {
      return __('Confirm Channel Removal');
    }
    return __('Confirm Removal');
  }

  // function revokeClaim() {
  //   tx ? abandonTxo(tx, cb) : abandonClaim(claim.txid, claim.nout, cb);
  //   closeModal();
  // }

  // const label = getButtonLabel(type, isSupport);

  function removeCard(context) {
    console.log(context);
    console.log('this');
    console.log(this);
    console.log(that);
    alert('hello!');
    // console.log('running here')
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
