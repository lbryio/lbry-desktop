import React from "react";
import TransactionListItem from "./internal/TransactionListItem";
import FormField from "component/formField";

class TransactionList extends React.PureComponent {
  constructor(props) {
    super(props);

    this.state = {
      filter: null,
    };
  }

  handleFilterChanged(event) {
    this.setState({
      filter: event.target.value,
    });
  }

  filterTransaction(transaction) {
    const { filter } = this.state;

    return !filter || filter == transaction.type;
  }

  render() {
    const { emptyMessage, rewards, transactions } = this.props;

    let transactionList = transactions.filter(
      this.filterTransaction.bind(this)
    );

    return (
      <div>
        {(transactionList.length || this.state.filter) &&
          <span className="sort-section">
            {__("Filter")} {" "}
            <FormField
              type="select"
              onChange={this.handleFilterChanged.bind(this)}
            >
              <option value="">{__("All")}</option>
              <option value="spend">{__("Spends")}</option>
              <option value="receive">{__("Receives")}</option>
              <option value="publish">{__("Publishes")}</option>
              <option value="channel">{__("Channels")}</option>
              <option value="tip">{__("Tips")}</option>
              <option value="support">{__("Supports")}</option>
              <option value="update">{__("Updates")}</option>
            </FormField>
          </span>}
        {!transactionList.length &&
          <div className="empty">
            {emptyMessage || __("No transactions to list.")}
          </div>}
        {Boolean(transactionList.length) &&
          <table className="table-standard table-transactions table-stretch">
            <thead>
              <tr>
                <th>{__("Date")}</th>
                <th>{__("Amount (Fee)")}</th>
                <th>{__("Type")} </th>
                <th>{__("Details")} </th>
                <th>{__("Transaction")}</th>
              </tr>
            </thead>
            <tbody>
              {transactionList.map(t =>
                <TransactionListItem
                  key={`${t.txid}:${t.nout}`}
                  transaction={t}
                  reward={rewards && rewards[t.txid]}
                />
              )}
            </tbody>
          </table>}
      </div>
    );
  }
}

export default TransactionList;
