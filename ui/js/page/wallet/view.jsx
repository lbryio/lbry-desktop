import React from "react";
import SubHeader from "component/subHeader";
import TransactionList from "component/transactionList";
import WalletAddress from "component/walletAddress";
import WalletSend from "component/walletSend";
import Link from "component/link";
import { CreditAmount } from "component/common";

const WalletPage = props => {
  const { balance, currentPage, navigate } = props;

  return (
    <main className="main--single-column">
      <SubHeader />
      <section className="card">
        <div className="card__title-primary">
          <h3>{__("Balance")}</h3>
        </div>
        <div className="card__content">
          <CreditAmount amount={balance} precision={8} />
        </div>
        <div className="card__content">
          <div className="help">
            <Link
              onClick={() => navigate("/backup")}
              label={__("Backup Your Wallet")}
            />
          </div>
        </div>
      </section>
      {currentPage === "wallet" ? <TransactionList {...props} /> : ""}
      {currentPage === "send" ? <WalletSend {...props} /> : ""}
      {currentPage === "receive" ? <WalletAddress /> : ""}
    </main>
  );
};

export default WalletPage;
