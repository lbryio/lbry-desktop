// @flow
import React from 'react';
import { Modal } from 'modal/modal';
import Button from 'component/button';
import Card from 'component/common/card';
import I18nMessage from 'component/i18nMessage';

type Props = {
  chargeCode: string,
  removeCoinSwap: (string) => void,
  closeModal: () => void,
};

function ModalRemoveBtcSwapAddress(props: Props) {
  const { chargeCode, removeCoinSwap, closeModal } = props;

  return (
    <Modal isOpen contentLabel={__('Confirm Swap Removal')} type="card" onAborted={closeModal}>
      <Card
        title={__('Remove Swap')}
        subtitle={<I18nMessage tokens={{ address: <em>{`${chargeCode}`}</em> }}>Remove %address%?</I18nMessage>}
        body={<p className="help--warning">{__('This process cannot be reversed.')}</p>}
        actions={
          <>
            <div className="section__actions">
              <Button
                button="primary"
                label={__('OK')}
                onClick={() => {
                  removeCoinSwap(chargeCode);
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
