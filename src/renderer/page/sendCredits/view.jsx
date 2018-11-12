import React from 'react';
import WalletSend from 'component/walletSend';
import WalletAddress from 'component/walletAddress';
import Page from 'component/page';

const SendReceivePage = props => (
  <Page>
    <WalletSend />
    <WalletAddress />
  </Page>
);

export default SendReceivePage;
