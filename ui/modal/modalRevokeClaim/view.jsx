// @flow
import React, { useState } from 'react';
import { Modal } from 'modal/modal';
import { FormField } from 'component/common/form';
import * as txnTypes from 'constants/transaction_types';

type Props = {
  closeModal: () => void,
  abandonClaim: (string, number) => void,
  txid: string,
  nout: number,
  transactionItems: Array<Transaction>,
};

export default function ModalRevokeClaim(props: Props) {
  const { transactionItems, txid, nout, closeModal } = props;
  const { type, claim_name: name } = transactionItems.find(claim => claim.txid === txid && claim.nout === nout) || {};
  const [channelName, setChannelName] = useState('');

  function getButtonLabel(type: string) {
    if (type === txnTypes.TIP) {
      return 'Confirm Tip Unlock';
    } else if (type === txnTypes.SUPPORT) {
      return 'Confirm Support Revoke';
    }
    return 'Confirm Claim Revoke';
  }

  function getMsgBody(type: string, name: string) {
    if (type === txnTypes.TIP) {
      return (
        <React.Fragment>
          <p>{__('Are you sure you want to unlock these credits?')}</p>
          <p>
            {__(
              'These credits are permanently yours and can be unlocked at any time. Unlocking them allows you to spend them, but can hurt the performance of your content in lookups and search results. It is recommended you leave tips locked until you need or want to spend them.'
            )}
          </p>
        </React.Fragment>
      );
    } else if (type === txnTypes.SUPPORT) {
      return (
        <React.Fragment>
          <p>{__('Are you sure you want to remove this support?')}</p>
          <p>
            {__(
              "These credits are permanently yours and can be removed at any time. Removing this support will reduce the claim's discoverability and return the LBC to your spendable balance."
            )}
          </p>
        </React.Fragment>
      );
    } else if (type === txnTypes.CHANNEL || (type === txnTypes.UPDATE && name.startsWith('@'))) {
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
        <p>{__('Are you sure want to revoke this claim?')}</p>
        <p>
          {__(
            'This will prevent others from resolving and accessing the content you published. It will return the LBC to your spendable balance, less a small transaction fee.'
          )}
        </p>
        <p className="help error__text"> {__('FINAL WARNING: This action is permanent and cannot be undone.')}</p>
      </React.Fragment>
    );
  }

  function revokeClaim() {
    const { txid, nout } = props;

    props.closeModal();
    props.abandonClaim(txid, nout);
  }

  return (
    <Modal
      isOpen
      title={getButtonLabel(type)}
      contentLabel={getButtonLabel(type)}
      type="confirm"
      confirmButtonLabel={getButtonLabel(type)}
      onConfirmed={revokeClaim}
      onAborted={closeModal}
      confirmButtonDisabled={type === txnTypes.CHANNEL && name !== channelName}
    >
      <section>{getMsgBody(type, name)}</section>
    </Modal>
  );
}
