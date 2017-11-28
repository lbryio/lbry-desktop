import React from "react";
import SubHeader from "component/subHeader";
import WalletSend from "component/walletSend";

const SendCreditsPage = props => {
  return (
    <main className="main--single-column">
      <SubHeader />
      <WalletSend />
    </main>
  );
};

export default SendCreditsPage;
