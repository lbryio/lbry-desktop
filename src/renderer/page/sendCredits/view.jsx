import React from 'react';
import SubHeader from 'component/subHeader';
import WalletSend from 'component/walletSend';
import WalletAddress from 'component/walletAddress';

const SendReceivePage = props => (
  <main className="main--single-column">
    <SubHeader />
    <WalletSend />
    <WalletAddress />
  </main>
);

export default SendReceivePage;
