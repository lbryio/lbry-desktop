// @flow
import React from 'react';
import Button from 'component/button';
import { Form } from 'component/common/form';
import { Modal } from 'modal/modal';
import Card from 'component/common/card';
import LbcSymbol from 'component/common/lbc-symbol';
import ClaimPreview from 'component/claimPreview';

type TipParams = { amount: number, claim_id: string, channel_id?: string };

type Props = {
  destination: string,
  amount: number,
  closeModal: () => void,
  sendToAddress: (string, number) => void,
  sendTip: (TipParams, boolean) => void,
  isAddress: boolean,
  claim: StreamClaim,
  activeChannelClaim: ?ChannelClaim,
  incognito: boolean,
  setConfirmed: (boolean) => void,
};

class ModalConfirmTransaction extends React.PureComponent<Props> {
  onConfirmed() {
    const { closeModal, sendToAddress, sendTip, amount, destination, isAddress, claim, setConfirmed } = this.props;
    if (!isAddress) {
      const claimId = claim && claim.claim_id;
      const tipParams: TipParams = { amount: amount, claim_id: claimId };
      sendTip(tipParams, false);
    } else {
      sendToAddress(destination, amount);
    }
    setConfirmed(true);
    closeModal();
  }

  render() {
    const { amount, destination, closeModal, isAddress, incognito, activeChannelClaim } = this.props;
    const activeChannelUrl = activeChannelClaim && activeChannelClaim.canonical_url;
    const title = __('Confirm Transaction');
    return (
      <Modal isOpen contentLabel={title} type="card" onAborted={closeModal}>
        <Form onSubmit={() => this.onConfirmed()}>
          <Card
            title={title}
            body={
              <div className="section section--padded card--inline confirm__wrapper">
                <div className="section">
                  <div className="confirm__label">{__('Sending')}</div>
                  <div className="confirm__value">{<LbcSymbol postfix={amount} size={22} />}</div>

                  {!isAddress && <div className="confirm__label">{__('From --[the tip sender]--')}</div>}
                  {!isAddress && (
                    <div className="confirm__value">
                      {incognito ? (
                        'Anonymous'
                      ) : (
                        <ClaimPreview
                          key={activeChannelUrl}
                          uri={activeChannelUrl}
                          actions={''}
                          type={'small'}
                          hideMenu
                          hideRepostLabel
                        />
                      )}
                    </div>
                  )}

                  <div className="confirm__label">{__('To --[the tip recipient]--')}</div>
                  <div className="confirm__value">
                    {!isAddress ? (
                      <ClaimPreview
                        key={destination}
                        uri={destination}
                        actions={''}
                        type={'small'}
                        hideMenu
                        hideRepostLabel
                      />
                    ) : (
                      destination
                    )}
                  </div>
                </div>
              </div>
            }
            actions={
              <>
                <div className="section__actions">
                  <Button autoFocus button="primary" label={__('Send')} onClick={() => this.onConfirmed()} />
                  <Button button="link" label={__('Cancel')} onClick={closeModal} />
                </div>
                <p className="help">{__('Once the transaction is sent, it cannot be reversed.')}</p>
              </>
            }
          />
        </Form>
      </Modal>
    );
  }
}

export default ModalConfirmTransaction;
