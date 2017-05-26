import React from 'react';
import Link from 'component/link';
import Modal from 'component/modal';
import {
  FormRow
} from 'component/form';

const WalletSend = (props) => {
  const {
    sendToAddress,
    closeModal,
    modal,
    setAmount,
    setAddress,
    amount,
    address,
  } = props

  return (
    <section className="card">
      <form onSubmit={sendToAddress}>
        <div className="card__title-primary">
          <h3>Send Credits</h3>
        </div>
        <div className="card__content">
          <FormRow label="Amount" postfix="LBC" step="0.01" type="number" placeholder="1.23" size="10" onChange={setAmount} value={amount} />
        </div>
        <div className="card__content">
          <FormRow label="Recipient Address" placeholder="bbFxRyXXXXXXXXXXXZD8nE7XTLUxYnddTs" type="text" size="60" onChange={setAddress} value={address} />
        </div>
        <div className="card__actions card__actions--form-submit">
          <Link button="primary" label="Send" onClick={sendToAddress} disabled={!(parseFloat(amount) > 0.0) || !address} />
          <input type='submit' className='hidden' />
        </div>
      </form>
      {modal == 'insufficientBalance' && <Modal isOpen={true} contentLabel="Insufficient balance" onConfirmed={closeModal}>
        Insufficient balance: after this transaction you would have less than 1 LBC in your wallet.
      </Modal>}
      {modal == 'transactionSuccessful' && <Modal isOpen={true} contentLabel="Transaction successful" onConfirmed={closeModal}>
        Your transaction was successfully placed in the queue.
      </Modal>}
      {modal == 'transactionFailed' && <Modal isOpen={true} contentLabel="Transaction failed" onConfirmed={closeModal}>
        Something went wrong:
      </Modal>}
    </section>
  )
}

export default WalletSend