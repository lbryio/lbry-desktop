import React from "react";
import SubHeader from "component/subHeader";
import WalletBalance from "component/walletBalance";
import RewardSummary from "component/rewardSummary";
import TransactionListRecent from "component/transactionListRecent";

const WalletPage = props => {
  return (
    <main className="main--single-column page--wallet">
      <SubHeader />
      <div className="card-grid">
        <WalletBalance />
        <RewardSummary />
      </div>
      <TransactionListRecent />
    </main>
  );
};

export default WalletPage;
