import React from 'react';
import lbry from 'lbry.js';
import Link from 'component/link';
import Modal from 'component/modal';
import {
  FormField,
  FormRow
} from 'component/form';
import {
  Address,
  BusyMessage,
  CreditAmount
} from 'component/common';

class AddressSection extends React.Component {
  componentWillMount() {
    this.props.checkAddressIsMine(this.props.receiveAddress)
  }

  render() {
    const {
      receiveAddress,
      getNewAddress,
      gettingNewAddress,
    } = this.props

    return (
      <section className="card">
        <div className="card__title-primary">
          <h3>Wallet Address</h3>
        </div>
        <div className="card__content">
          <Address address={receiveAddress} />
        </div>
        <div className="card__actions">
          <Link label="Get New Address" button="primary" icon='icon-refresh' onClick={getNewAddress} disabled={gettingNewAddress} />
        </div>
        <div className="card__content">
          <div className="help">
            <p>Other LBRY users may send credits to you by entering this address on the "Send" page.</p>
            <p>You can generate a new address at any time, and any previous addresses will continue to work. Using multiple addresses can be helpful for keeping track of incoming payments from multiple sources.</p>
          </div>
        </div>
      </section>
    );
  }
}

const SendToAddressSection = (props) => {
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

// var SendToAddressSection = React.createClass({
//   handleSubmit: function(event) {
//     if (typeof event !== 'undefined') {
//       event.preventDefault();
//     }

//     if ((this.state.balance - this.state.amount) < 1)
//     {
//       this.setState({
//         modal: 'insufficientBalance',
//       });
//       return;
//     }

//     this.setState({
//       results: "",
//     });

//     lbry.sendToAddress(this.state.amount, this.state.address, (results) => {
//       if(results === true)
//       {
//         this.setState({
//           results: "Your transaction was successfully placed in the queue.",
//         });
//       }
//       else
//       {
//         this.setState({
//           results: "Something went wrong: " + results
//         });
//       }
//     }, (error) => {
//       this.setState({
//         results: "Something went wrong: " + error.message
//       })
//     });
//   },
//   closeModal: function() {
//     this.setState({
//       modal: null,
//     });
//   },
//   getInitialState: function() {
//     return {
//       address: "",
//       amount: 0.0,
//       balance: <BusyMessage message="Checking balance" />,
//       results: "",
//     }
//   },
//   componentWillMount: function() {
//     lbry.getBalance((results) => {
//       this.setState({
//         balance: results,
//       });
//     });
//   },
//   setAmount: function(event) {
//     this.setState({
//       amount: parseFloat(event.target.value),
//     })
//   },
//   setAddress: function(event) {
//     this.setState({
//       address: event.target.value,
//     })
//   },
//   render: function() {
//     return (
//       <section className="card">
//         <form onSubmit={this.handleSubmit}>
//           <div className="card__title-primary">
//             <h3>Send Credits</h3>
//           </div>
//           <div className="card__content">
//             <FormRow label="Amount" postfix="LBC" step="0.01" type="number" placeholder="1.23" size="10" onChange={this.setAmount} />
//           </div>
//           <div className="card__content">
//             <FormRow label="Recipient Address" placeholder="bbFxRyXXXXXXXXXXXZD8nE7XTLUxYnddTs" type="text" size="60" onChange={this.setAddress} />
//           </div>
//           <div className="card__actions card__actions--form-submit">
//             <Link button="primary" label="Send" onClick={this.handleSubmit} disabled={!(parseFloat(this.state.amount) > 0.0) || this.state.address == ""} />
//             <input type='submit' className='hidden' />
//           </div>
//             {
//               this.state.results ?
//               <div className="card__content">
//                 <h4>Results</h4>
//                 {this.state.results}
//               </div> : ''
//             }
//         </form>
//         <Modal isOpen={this.state.modal === 'insufficientBalance'} contentLabel="Insufficient balance"
//                onConfirmed={this.closeModal}>
//           Insufficient balance: after this transaction you would have less than 1 LBC in your wallet.
//         </Modal>
//       </section>
//     );
//   }
// });

const TransactionList = (props) => {
  const {
    fetchingTransactions,
    transactionItems,
  } = props

  const rows = []
  if (transactionItems.length > 0) {
    transactionItems.forEach(function(item) {
      rows.push(
        <tr key={item.id}>
          <td>{ (item.amount > 0 ? '+' : '' ) + item.amount }</td>
          <td>{ item.date ? item.date.toLocaleDateString() : <span className="empty">(Transaction pending)</span> }</td>
          <td>{ item.date ? item.date.toLocaleTimeString() : <span className="empty">(Transaction pending)</span> }</td>
          <td>
            <a className="button-text" href={"https://explorer.lbry.io/tx/"+item.id} target="_blank">{item.id.substr(0, 7)}</a>
          </td>
        </tr>
      );
    });
  }

  return (
    <section className="card">
      <div className="card__title-primary">
        <h3>Transaction History</h3>
      </div>
      <div className="card__content">
        { fetchingTransactions ? <BusyMessage message="Loading transactions" /> : '' }
        { !fetchingTransactions && rows.length === 0 ? <div className="empty">You have no transactions.</div> : '' }
        { rows.length > 0 ?
          <table className="table-standard table-stretch">
            <thead>
              <tr>
                <th>Amount</th>
                <th>Date</th>
                <th>Time</th>
                <th>Transaction</th>
              </tr>
            </thead>
            <tbody>
              {rows}
            </tbody>
          </table>
          : ''
        }
      </div>
    </section>
  )
}

const WalletPage = (props) => {
  const {
    balance,
    currentPage
  } = props

  return (
    <main className="page">
      <section className="card">
        <div className="card__title-primary">
          <h3>Balance</h3>
        </div>
        <div className="card__content">
          <CreditAmount amount={balance} precision={8} />
        </div>
      </section>
      { currentPage === 'wallet' ? <TransactionList {...props} /> : '' }
      { currentPage === 'send' ? <SendToAddressSection {...props} /> : '' }
      { currentPage === 'receive' ? <AddressSection {...props} /> : '' }
    </main>
  )
}

export default WalletPage;
