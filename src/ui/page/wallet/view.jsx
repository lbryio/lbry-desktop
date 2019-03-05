import React from 'react';
import WalletBalance from 'component/walletBalance';
import RewardSummary from 'component/rewardSummary';
import TransactionListRecent from 'component/transactionListRecent';
import WalletAddress from 'component/walletAddress';
import Page from 'component/page';

const WalletPage = () => (
  <Page>
    <div className="columns">
      <WalletBalance />
      <RewardSummary />
    </div>
    <WalletAddress />
    <TransactionListRecent />
  </Page>
);

export default WalletPage;
