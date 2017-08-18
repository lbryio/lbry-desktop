import React from "react";
import SubHeader from "component/subHeader";
import WalletBalance from "component/walletBalance";
import WalletAddress from "component/walletAddress";

const ReceiveCreditsPage = props => {
  return (
    <main className="main--single-column">
      <SubHeader />
      <WalletAddress />
    </main>
  );
};

export default ReceiveCreditsPage;
