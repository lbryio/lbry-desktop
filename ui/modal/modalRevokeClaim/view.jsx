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
  abandonClaim: (Claim, ?() => void) => void,
  tx: Txo,
  claim: Claim,
  cb: () => void,
  doResolveUri: (string) => void,
};

export default function ModalRevokeClaim(props: Props) {
  const { tx, claim, closeModal, abandonTxo, abandonClaim, cb, doResolveUri } = props;
  const { value_type: valueType, type, normalized_name: name, is_my_input: isSupport } = tx || claim;
  const [channelName, setChannelName] = useState('');

  React.useEffect(() => {
    if (claim) {
      doResolveUri(claim.permanent_url);
    }
  }, [claim, doResolveUri]);

  const shouldConfirmChannel =
    valueType === txnTypes.CHANNEL || type === txnTypes.CHANNEL || (type === txnTypes.UPDATE && name.startsWith('@'));

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

  function getMsgBody(type: string, isSupport: boolean, name: string) {
    if (isSupport && type === txnTypes.SUPPORT) {
      return (
        <React.Fragment>
          <p>{__('Are you sure you want to remove this boost?')}</p>
          <p>
            <I18nMessage tokens={{ lbc: <LbcSymbol /> }}>
              These Credits are permanently yours and this boost can be removed at any time. Removing this boost will
              reduce discoverability and return %lbc% to your spendable balance.
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
              'These Credits are permanently yours and can be unlocked at any time. Unlocking them allows you to spend them, but reduces discoverability of your content in lookups and search results. It is recommended you leave Credits locked until you need or want to spend them.'
            )}
          </p>
        </React.Fragment>
      );
    } else if (shouldConfirmChannel) {
      return (
        <React.Fragment>
          <p>
            {__('This will permanently remove your channel. Content published under this channel will be orphaned.')}
          </p>
          <p>
            {__(
              'If this is a YouTube synced channel, it cannot be reprocessed again. Reach out to us via the Help page if you are not sure about deletion.'
            )}
          </p>
          <p>{__('Are you sure? Type %name% to confirm that you wish to remove the channel.', { name })}</p>
          <FormField type={'text'} onChange={(e) => setChannelName(e.target.value)} />
        </React.Fragment>
      );
    }

    return (
      <React.Fragment>
        <p>{__('Are you sure you want to remove this?')}</p>
        <p>
          <I18nMessage tokens={{ lbc: <LbcSymbol /> }}>
            This will prevent others from resolving and accessing the content you published. It will return the %lbc% to
            your spendable balance.
          </I18nMessage>
        </p>
        <p className="help error__text"> {__('FINAL WARNING: This action is permanent and cannot be undone.')}</p>
      </React.Fragment>
    );
  }

  function revokeClaim() {
    tx ? abandonTxo(tx, cb) : abandonClaim(claim, cb);
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
