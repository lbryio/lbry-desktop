import React from 'react';
import WalletBalance from 'component/walletBalance';
import WalletSend from 'component/walletSend';
import WalletAddress from 'component/walletAddress';
import TransactionListRecent from 'component/transactionListRecent';
import Page from 'component/page';
import UnsupportedOnWeb from 'component/common/unsupported-on-web';

const WalletPage = () => (
  <Page>
    <UnsupportedOnWeb />
    <div className={IS_WEB && 'card--disabled'}>
      <WalletBalance />
      <WalletSend />
      <WalletAddress />
      <TransactionListRecent />
    </div>
  </Page>
);

export default WalletPage;
