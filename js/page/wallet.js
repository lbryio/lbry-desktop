import React from 'react';
import lbry from '../lbry.js';
import {Link} from '../component/link.js';
import Modal from '../component/modal.js';
import {Address, BusyMessage, CreditAmount} from '../component/common.js';


var addressRefreshButtonStyle = {
  fontSize: '11pt',
};
var AddressSection = React.createClass({
  _refreshAddress: function(event) {
    if (typeof event !== 'undefined') {
      event.preventDefault();
    }

    lbry.getNewAddress((address) => {
      localStorage.setItem('wallet_address', address);
      this.setState({
        address: address,
      });
    });
  },
  getInitialState: function() {
    return {
      address: null,
      modal: null,
    }
  },
  componentWillMount: function() {
    var address = localStorage.getItem('wallet_address');
    if (address === null) {
      this._refreshAddress();
    } else {
      lbry.checkAddressIsMine(address, (isMine) => {
        if (isMine) {
          this.setState({
            address: address,
          });
        } else {
          this._refreshAddress();
        }
      });
    }
  },
  render: function() {
    return (
      <section className="card">
        <h3>Wallet Address</h3>
        <Address address={this.state.address} /> <Link text="Get new address" icon='icon-refresh' onClick={this._refreshAddress} style={addressRefreshButtonStyle} />
        <input type='submit' className='hidden' />
        <div className="help">
          <p>Other LBRY users may send credits to you by entering this address on the "Send" page.</p>
          You can generate a new address at any time, and any previous addresses will continue to work. Using multiple addresses can be helpful for keeping track of incoming payments from multiple sources.
        </div>
      </section>
    );
  }
});

var SendToAddressSection = React.createClass({
  handleSubmit: function(event) {
    if (typeof event !== 'undefined') {
      event.preventDefault();
    }

    if ((this.state.balance - this.state.amount) < 1)
    {
      this.setState({
        modal: 'insufficientBalance',
      });
      return;
    }

    this.setState({
      results: "",
    });

    lbry.sendToAddress(this.state.amount, this.state.address, (results) => {
      if(results === true)
      {
        this.setState({
          results: "Your transaction was successfully placed in the queue.",
        });
      }
      else
      {
        this.setState({
          results: "Something went wrong: " + results
        });
      }
    }, (error) => {
      this.setState({
        results: "Something went wrong: " + error.faultString + " " + error.faultCode
      })
    });
  },
  closeModal: function() {
    this.setState({
      modal: null,
    });
  },
  getInitialState: function() {
    return {
      address: "",
      amount: 0.0,
      balance: <BusyMessage message="Checking balance" />,
      results: "",
    }
  },
  componentWillMount: function() {
    lbry.getBalance((results) => {
      this.setState({
        balance: results,
      });
    });
  },
  setAmount: function(event) {
    this.setState({
      amount: parseFloat(event.target.value),
    })
  },
  setAddress: function(event) {
    this.setState({
      address: event.target.value,
    })
  },
  render: function() {
    return (
      <section className="card">
        <form onSubmit={this.handleSubmit}>
          <h3>Send Credits</h3>
          <div className="form-row">
            <label htmlFor="amount">Amount</label>
            <input id="amount" type="text" size="10" onChange={this.setAmount}></input>
          </div>
          <div className="form-row">
            <label htmlFor="address">Recipient address</label>
            <input id="address" type="text" size="60" onChange={this.setAddress}></input>
          </div>
          <div className="form-row form-row-submit">
            <Link button="primary" label="Send" onClick={this.handleSubmit} disabled={!(parseFloat(this.state.amount) > 0.0) || this.state.address == ""} />
            <input type='submit' className='hidden' />
          </div>
          {
            this.state.results ?
            <div className="form-row">
              <h4>Results</h4>
              {this.state.results}
            </div>
              : ''
          }
        </form>
        <Modal isOpen={this.state.modal === 'insufficientBalance'} onConfirmed={this.closeModal}>
          Insufficient balance: after this transaction you would have less than 1 LBC in your wallet.
        </Modal>
      </section>
    );
  }
});


var TransactionList = React.createClass({
  getInitialState: function() {
    return {
      transactionItems: null,
    }
  },
  componentWillMount: function() {
    lbry.call('get_transaction_history', {}, (results) => {
      if (results.length == 0) {
        this.setState({ transactionItems: [] })
      } else {
        var transactionItems = [],
            condensedTransactions = {};
        results.forEach(function(tx) {
          var txid = tx["txid"];
          if (!(txid in condensedTransactions)) {
            condensedTransactions[txid] = 0;
          }
          condensedTransactions[txid] += parseFloat(tx["value"]);
        });
        results.reverse().forEach(function(tx) {
          var txid = tx["txid"];
          if (condensedTransactions[txid] && condensedTransactions[txid] != 0)
          {
            transactionItems.push({
              id: txid,
              date: tx["timestamp"] ? (new Date(parseInt(tx["timestamp"]) * 1000)) : null,
              amount: condensedTransactions[txid]
            });
            delete condensedTransactions[txid];
          }
        });

        this.setState({ transactionItems: transactionItems });
      }
    });
  },
  render: function() {
    var rows = [];
    if (this.state.transactionItems && this.state.transactionItems.length > 0)
    {
      this.state.transactionItems.forEach(function(item) {
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
        <h3>Transaction History</h3>
        { this.state.transactionItems === null ? <BusyMessage message="Loading transactions" /> : '' }
        { this.state.transactionItems && rows.length === 0 ? <div className="empty">You have no transactions.</div> : '' }
        { this.state.transactionItems && rows.length > 0 ?
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
      </section>
    );
  }
});


var WalletPage = React.createClass({
  propTypes: {
    viewingPage: React.PropTypes.string,
  },
  componentDidMount: function() {
    document.title = "My Wallet";
  },
  /*
   Below should be refactored so that balance is shared all of wallet page. Or even broader?
   What is the proper React pattern for sharing a global state like balance?
   */
  getInitialState: function() {
    return {
      balance: null,
    }
  },
  componentWillMount: function() {
    lbry.getBalance((results) => {
      this.setState({
        balance: results,
      })
    });
  },
  render: function() {
    return (
      <main className="page">
        <section className="card">
          <h3>Balance</h3>
          { this.state.balance === null ? <BusyMessage message="Checking balance" /> : ''}
          { this.state.balance !== null ? <CreditAmount amount={this.state.balance} precision={8} /> : '' }
        </section>
        { this.props.viewingPage === 'wallet' ? <TransactionList /> : '' }
        { this.props.viewingPage === 'send' ? <SendToAddressSection /> : '' }
        { this.props.viewingPage === 'receive' ? <AddressSection /> : '' }
      </main>
    );
  }
});

export default WalletPage;
