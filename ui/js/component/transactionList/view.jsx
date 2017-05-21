import React from 'react';
import {
  Address,
  BusyMessage,
  CreditAmount
} from 'component/common';

class TransactionList extends React.Component{
  componentWillMount() {
    this.props.fetchTransactions()
  }

  render() {
    const {
      fetchingTransactions,
      transactionItems,
    } = this.props

    const rows = []
    if (transactionItems.length > 0) {
      transactionItems.forEach(function (item) {
        rows.push(
          <tr key={item.id}>
            <td>{ (item.amount > 0 ? '+' : '' ) + item.amount }</td>
            <td>{ item.date ? item.date.toLocaleDateString() : <span className="empty">(Transaction pending)</span> }</td>
            <td>{ item.date ? item.date.toLocaleTimeString() : <span className="empty">(Transaction pending)</span> }</td>
            <td>
              <a className="button-text" href={"https://explorer.lbry.io/#!/transaction?id="+item.id}>{item.id.substr(0, 7)}</a>
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
          { fetchingTransactions && <BusyMessage message="Loading transactions" /> }
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
}

export default TransactionList