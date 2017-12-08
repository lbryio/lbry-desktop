import React from "react";
import { BusyMessage } from "component/common";
import SubHeader from "component/subHeader";
import TransactionList from "component/transactionList";

class TransactionHistoryPage extends React.PureComponent {
  componentWillMount() {
    this.props.fetchTransactions();
  }

  render() {
    const { fetchingTransactions, transactions } = this.props;

    return (
      <main className="main--single-column">
        <SubHeader />
        <section className="card">
          <div
            className={
              "card__title-primary " +
              (fetchingTransactions && transactions.length ? "reloading" : "")
            }
          >
            <h3>{__("Transaction History")}</h3>
          </div>
          <div className="card__content">
            {fetchingTransactions && !transactions.length ? (
              <BusyMessage message={__("Loading transactions")} />
            ) : (
              ""
            )}
            {transactions && transactions.length ? (
              <TransactionList transactions={transactions} />
            ) : (
              ""
            )}
          </div>
        </section>
      </main>
    );
  }
}

export default TransactionHistoryPage;
