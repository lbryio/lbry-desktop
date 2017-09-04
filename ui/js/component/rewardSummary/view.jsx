import React from "react";
import Link from "component/link";
import { CreditAmount } from "component/common";

const RewardSummary = props => {
  const { balance, unclaimedRewardAmount } = props;

  return (
    <section className="card">
      <div className="card__title-primary">
        <h3>{__("Rewards")}</h3>
        <p>{__("Eligible")}
        {user && user.is_reward_approved
          ? <Icon icon="icon-check" />
          : <Icon icon="icon-ban" />}
        </p>
      </div>
      <div className="card__content">
        {unclaimedRewardAmount > 0 &&
          <p>
            You have{" "}
            <CreditAmount amount={unclaimedRewardAmount} precision={8} /> in
            unclaimed rewards.
          </p>}
      </div>
      <div className="card__actions card__actions--bottom">
        <Link button="text" navigate="/rewards" label={__("Rewards")} />
        <Link button="text" navigate="/invite" label={__("Invites")} />
      </div>
    </section>
  );
};

export default RewardSummary;
