import React from "react";
import Link from "component/link";
import { CreditAmount } from "component/common";

const RewardSummary = props => {
  const { balance, unclaimedRewardAmount } = props;

  return (
    <section className="card">
      <div className="card__title-primary">
        <h3>{__("Rewards")}</h3>
      </div>
      <div className="card__content">
        {unclaimedRewardAmount > 0 &&
          <p>
            You have{" "}
            <CreditAmount amount={unclaimedRewardAmount} precision={8} /> in
            unclaimed rewards.
          </p>}
      </div>
      <div className="card__actions">
        <Link button="alt" navigate="/rewards" label={__("Learn more")} />
      </div>
    </section>
  );
};

export default RewardSummary;
