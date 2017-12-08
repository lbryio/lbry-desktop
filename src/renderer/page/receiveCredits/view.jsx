import React from "react";
import SubHeader from "component/subHeader";
import Link from "component/link";
import WalletAddress from "component/walletAddress";
import ShapeShift from "component/shapeShift";

const ReceiveCreditsPage = props => {
  return (
    <main className="main--single-column">
      <SubHeader />
      <WalletAddress />
      <ShapeShift />
      <section className="card">
        <div className="card__title-primary">
          <h3>{__("More ways to get LBRY Credits")}</h3>
        </div>
        <div className="card__content">
          <p>
            {
              "LBRY credits can be purchased on exchanges, earned for contributions, for mining, and more."
            }
          </p>
        </div>
        <div className="card__actions">
          <Link
            button="alt"
            href="https://lbry.io/faq/earn-credits"
            label={__("Read More")}
          />
        </div>
      </section>
    </main>
  );
};

export default ReceiveCreditsPage;
