// @flow
import React from 'react';
import { parseURI } from 'lbry-redux';
import Button from 'component/button';
import { Form } from 'component/common/form';
import { Modal } from 'modal/modal';
import Card from 'component/common/card';

type Props = {
  uri: string,
  claimId: string,
  title: string,
  tipAmount: number,
  isSupport: boolean,
  closeModal: () => void,
  sendSupport: (number, string, boolean) => void,
};

class ModalConfirmSendTip extends React.PureComponent<Props> {
  onConfirmed() {
    const { closeModal, sendSupport, tipAmount, claimId, isSupport } = this.props;
    sendSupport(tipAmount, claimId, isSupport);
    closeModal();
  }

  render() {
    const { tipAmount, title, isSupport, closeModal, uri } = this.props;
    const cardTitle = __(isSupport ? 'Confirm Support' : 'Confirm Tip');
    const { channelName } = parseURI(uri);

    return (
      <Modal isOpen type="card" onAborted={closeModal} contentLabel={cardTitle}>
        <Form onSubmit={() => this.onConfirmed()}>
          <Card
            title={cardTitle}
            body={
              <>
                <div className="section">
                  <label>{__(isSupport ? 'Supporting: ' : 'Tipping: ')}</label>
                  <blockquote>{tipAmount} LBC</blockquote>
                </div>
                <div className="section">
                  <label>{__('To: ')}</label>
                  <blockquote>{title || channelName}</blockquote>
                </div>
              </>
            }
            actions={
              <div className="section__actions">
                <Button autoFocus button="primary" type="submit" label={__('Send')} />
                <Button button="link" label={__('Cancel')} onClick={closeModal} />
              </div>
            }
          />
        </Form>
      </Modal>
    );
  }
}

export default ModalConfirmSendTip;
