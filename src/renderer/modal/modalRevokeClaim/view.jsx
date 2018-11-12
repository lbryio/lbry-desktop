// @flow
import React from 'react';
import { Modal } from 'modal/modal';
import * as txnTypes from 'constants/transaction_types';

type Props = {
  closeModal: () => void,
  abandonClaim: (string, number) => void,
  txid: string,
  nout: number,
};

class ModalRevokeClaim extends React.PureComponent<Props> {
  constructor() {
    super();

    (this: any).revokeClaim = this.revokeClaim.bind(this);
  }

  getButtonLabel(type) {
    if (type === txnTypes.TIP) {
      return 'Confirm Tip Unlock';
    }
    return 'Confirm Claim Revoke';
  }

  getMsgBody(type) {
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
    }
    return (
      <React.Fragment>
        <p>{__('Are you sure want to revoke this claim?')}</p>
        <p>
          {__(
            'This will prevent others from resolving and accessing the content you published. It will return the LBC to your spendable balance, less a small transaction fee.'
          )}
        </p>
      </React.Fragment>
    );
  }

  revokeClaim() {
    const { txid, nout } = this.props;

    this.props.closeModal();
    this.props.abandonClaim(txid, nout);
  }

  render() {
    const { transactionItems, txid, nout, closeModal } = this.props;
    const { type } = transactionItems.find(claim => claim.txid == txid && claim.nout == nout);

    return (
      <Modal
        isOpen
        title={type === txnTypes.TIP ? __('Confirm Tip Unlock') : __('Confirm Claim Revoke')}
        contentLabel={__('Confirm Claim Revoke')}
        type="confirm"
        confirmButtonLabel={this.getButtonLabel(type)}
        onConfirmed={this.revokeClaim}
        onAborted={closeModal}
      >
        <section className="card__content">{this.getMsgBody(type)}</section>
      </Modal>
    );
  }
}

export default ModalRevokeClaim;
