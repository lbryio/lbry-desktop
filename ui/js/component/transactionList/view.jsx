import React from "react";
import { BusyMessage } from "component/common";
import LinkTransaction from "component/linkTransaction";

class TransactionList extends React.PureComponent {
  componentWillMount() {
    this.props.fetchTransactions();
  }

  render() {
    const { fetchingTransactions, transactionItems } = this.props;

    const rows = [];
    if (transactionItems.length > 0) {
      transactionItems.forEach(function(item) {
        rows.push(
          <tr key={item.id}>
            <td>{(item.amount > 0 ? "+" : "") + item.amount}</td>
            <td>
              {item.date
                ? item.date.toLocaleDateString()
                : <span className="empty">{__("(Transaction pending)")}</span>}
            </td>
            <td>
              {item.date
                ? item.date.toLocaleTimeString()
                : <span className="empty">{__("(Transaction pending)")}</span>}
            </td>
            <td>
              <LinkTransaction id={item.id} />
            </td>
          </tr>
        );
      });
    }

    return (
      <section className="card">
        <div className="card__title-primary">
          <h3>{__("Transaction History")}</h3>
        </div>
        <div className="card__content">
          {fetchingTransactions &&
            <BusyMessage message={__("Loading transactions")} />}
          {!fetchingTransactions && rows.length === 0
            ? <div className="empty">{__("You have no transactions.")}</div>
            : ""}
          {rows.length > 0
            ? <table className="table-standard table-stretch">
                <thead>
                  <tr>
                    <th>{__("Amount")}</th>
                    <th>{__("Date")}</th>
                    <th>{__("Time")}</th>
                    <th>{__("Transaction")}</th>
                  </tr>
                </thead>
                <tbody>
                  {rows}
                </tbody>
              </table>
            : ""}
        </div>
      </section>
    );
  }
}

export default TransactionList;
