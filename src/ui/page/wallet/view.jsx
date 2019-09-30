import React from 'react';
import WalletBalance from 'component/walletBalance';
import TransactionListRecent from 'component/transactionListRecent';
import Page from 'component/page';

const WalletPage = () => (
  <Page>
    <WalletBalance />
    <TransactionListRecent />
  </Page>
);

export default WalletPage;
