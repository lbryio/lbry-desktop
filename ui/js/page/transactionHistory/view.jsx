import React from "react";
import SubHeader from "component/subHeader";
import TransactionList from "component/transactionList";

const TransactionHistoryPage = props => {
  return (
    <main className="main--single-column">
      <SubHeader />
      <TransactionList />
    </main>
  );
};

export default TransactionHistoryPage;
