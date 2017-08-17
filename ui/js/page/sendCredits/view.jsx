import React from "react";
import SubHeader from "component/subHeader";
import WalletBalance from "component/walletBalance";
import WalletSend from "component/walletSend";

const SendCreditsPage = props => {
  return (
    <main className="main--single-column">
      <SubHeader />
      <WalletBalance />
      <WalletSend />
    </main>
  );
};

export default SendCreditsPage;
