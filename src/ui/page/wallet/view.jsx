import React from 'react';
import WalletBalance from 'component/walletBalance';
import WalletSend from 'component/walletSend';
import WalletAddress from 'component/walletAddress';
import TransactionListRecent from 'component/transactionListRecent';
import Page from 'component/page';

const WalletPage = () => (
  <Page>
    <WalletBalance />
    <WalletSend />
    <WalletAddress />
    <TransactionListRecent />
  </Page>
);

export default WalletPage;
