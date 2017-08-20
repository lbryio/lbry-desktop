import React from "react";
import { BusyMessage } from "component/common";
import Link from "component/link";
import TransactionList from "component/transactionList";

class TransactionListRecent extends React.PureComponent {
  componentWillMount() {
    this.props.fetchTransactions();
  }

  render() {
    const { fetchingTransactions, hasTransactions, transactions } = this.props;
    console.log(transactions);
    return (
      <section className="card">
        <div className="card__title-primary">
          <h3>{__("Recent Transactions")}</h3>
        </div>
        <div className="card__content">
          {fetchingTransactions &&
            <BusyMessage message={__("Loading transactions")} />}
          {!fetchingTransactions &&
            <TransactionList
              transactions={transactions}
              emptyMessage={__("You have no recent transactions.")}
            />}
        </div>
        {hasTransactions &&
          <div className="card__content">
            <Link
              navigate="/history"
              label={__("See Full History")}
              button="text"
            />
          </div>}
      </section>
    );
  }
}

export default TransactionListRecent;
