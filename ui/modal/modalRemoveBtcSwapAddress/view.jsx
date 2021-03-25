// @flow
import React from 'react';
import { Modal } from 'modal/modal';
import Button from 'component/button';
import Card from 'component/common/card';
import I18nMessage from 'component/i18nMessage';

type Props = {
  btcAddress: string,
  doRemoveBtcAddress: (string) => void,
  closeModal: () => void,
};

function ModalRemoveBtcSwapAddress(props: Props) {
  const { btcAddress, doRemoveBtcAddress, closeModal } = props;

  return (
    <Modal isOpen contentLabel={__('Confirm Address Removal')} type="card" onAborted={closeModal}>
      <Card
        title={__('Remove BTC Swap Address')}
        subtitle={<I18nMessage tokens={{ btc_address: <em>{`${btcAddress}`}</em> }}>Remove %btc_address%?</I18nMessage>}
        body={<p className="help--warning">{__('This process cannot be reversed.')}</p>}
        actions={
          <>
            <div className="section__actions">
              <Button
                button="primary"
                label={__('OK')}
                onClick={() => {
                  doRemoveBtcAddress(btcAddress);
                  closeModal();
                }}
              />
              <Button button="link" label={__('Cancel')} onClick={closeModal} />
            </div>
          </>
        }
      />
    </Modal>
  );
}

export default ModalRemoveBtcSwapAddress;
