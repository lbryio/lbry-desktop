// @flow
import React, { useState } from 'react';
import { Modal } from 'modal/modal';
import { FormField } from 'component/common/form';
import * as txnTypes from 'constants/transaction_types';
import Card from 'component/common/card';
import Button from 'component/button';
import I18nMessage from 'component/i18nMessage';
import LbcSymbol from 'component/common/lbc-symbol';

type Props = {
  closeModal: () => void,
  abandonTxo: (Txo, () => void) => void,
  abandonClaim: (string, number, ?() => void) => void,
  tx: Txo,
  claim: GenericClaim,
  cb: () => void,
};

export default function ModalRevokeClaim(props: Props) {
  const { tx, claim, closeModal, abandonTxo, abandonClaim, cb } = props;
  const { value_type: valueType, type, normalized_name: name, is_my_input: isSupport } = tx || claim;
  const [channelName, setChannelName] = useState('');

  const shouldConfirmChannel =
    valueType === txnTypes.CHANNEL || type === txnTypes.CHANNEL || (type === txnTypes.UPDATE && name.startsWith('@'));

  function getButtonLabel(type: string, isSupport: boolean) {
    if (isSupport && type === txnTypes.SUPPORT) {
      return __('Confirm Support Revoke');
    } else if (type === txnTypes.SUPPORT) {
      return __('Confirm Tip Unlock');
    }
    return __('Confirm Claim Revoke');
  }

  function getMsgBody(type: string, isSupport: boolean, name: string) {
    if (isSupport && type === txnTypes.SUPPORT) {
      return (
        <React.Fragment>
          <p>{__('Are you sure you want to remove this support?')}</p>
          <p>
            <I18nMessage tokens={{ lbc: <LbcSymbol /> }}>
              These Credits are permanently yours and can be removed at any time. Removing this support will reduce the
              claim's discoverability and return the %lbc% to your spendable balance.
            </I18nMessage>
          </p>
        </React.Fragment>
      );
    } else if (type === txnTypes.SUPPORT) {
      return (
        <React.Fragment>
          <p>{__('Are you sure you want to unlock these Credits?')}</p>
          <p>
            {__(
              'These Credits are permanently yours and can be unlocked at any time. Unlocking them allows you to spend them, but can hurt the performance of your content in lookups and search results. It is recommended you leave tips locked until you need or want to spend them.'
            )}
          </p>
        </React.Fragment>
      );
    } else if (shouldConfirmChannel) {
      return (
        <React.Fragment>
          <p>
            {__(
              "You're about to permanently delete a channel. Content published under this channel will be orphaned and their signing channel invalid. Content sync programs using this channel will fail."
            )}
          </p>
          <p>{__('Are you sure? Type %name% to confirm that you wish to delete the channel.', { name })}</p>
          <FormField type={'text'} onChange={e => setChannelName(e.target.value)} />
        </React.Fragment>
      );
    }

    return (
      <React.Fragment>
        <p>{__('Are you sure you want to revoke this claim?')}</p>
        <p>
          <I18nMessage tokens={{ lbc: <LbcSymbol /> }}>
            This will prevent others from resolving and accessing the content you published. It will return the %lbc% to
            your spendable balance, less a small transaction fee.
          </I18nMessage>
        </p>
        <p className="help error__text"> {__('FINAL WARNING: This action is permanent and cannot be undone.')}</p>
      </React.Fragment>
    );
  }

  function revokeClaim() {
    tx ? abandonTxo(tx, cb) : abandonClaim(claim.txid, claim.nout, cb);
    closeModal();
  }

  const label = getButtonLabel(type, isSupport);

  return (
    <Modal isOpen contentLabel={label} type="card" onAborted={closeModal}>
      <Card
        title={label}
        body={getMsgBody(type, isSupport, name)}
        actions={
          <div className="section__actions">
            <Button
              disabled={shouldConfirmChannel && name !== channelName}
              button="primary"
              label={label}
              onClick={revokeClaim}
            />
            <Button button="link" label={__('Cancel')} onClick={closeModal} />
          </div>
        }
      />
    </Modal>
  );
}
