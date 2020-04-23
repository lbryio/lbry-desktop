// @flow
import React from 'react';
import Button from 'component/button';
import { Form } from 'component/common/form';
import { Modal } from 'modal/modal';

type Props = {
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
    const { tipAmount, title, isSupport, closeModal } = this.props;
    return (
      <Modal
        isOpen
        title={__(isSupport ? 'Support LBC' : 'Tip LBC')}
        contentLabel={__(isSupport ? 'Confirm Support' : 'Confirm Tip')}
        type="custom"
        onAborted={closeModal}
      >
        <Form onSubmit={() => this.onConfirmed()}>
          <p>{__(isSupport ? 'Supporting: ' : 'Tipping: ')}</p>
          <blockquote>{tipAmount} LBC</blockquote>
          <p>{__('To: ')}</p>
          <blockquote>{title}</blockquote>
          <div className="card__actions">
            <Button autoFocus button="primary" label={__('Send')} onClick={() => this.onConfirmed()} />
            <Button button="link" label={__('Cancel')} onClick={closeModal} />
          </div>
        </Form>
      </Modal>
    );
  }
}

export default ModalConfirmSendTip;
