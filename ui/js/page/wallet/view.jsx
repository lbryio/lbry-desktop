import React from "react";
import SubHeader from "component/subHeader";
import WalletBalance from "component/walletBalance";
import RewardSummary from "component/rewardSummary";
import InviteSummary from "component/inviteSummary";
import TransactionListRecent from "component/transactionListRecent";

const WalletPage = props => {
  return (
    <main className="main--single-column">
      <SubHeader />
      <WalletBalance />
      <RewardSummary />
      <InviteSummary />
      <TransactionListRecent />
    </main>
  );
};

export default WalletPage;
