import React from "react";
import { CreditAmount, Icon } from "component/common";
import RewardLink from "component/rewardLink";
import Link from "component/link";
import rewards from "rewards";

const RewardTile = props => {
  const { reward } = props;

  const claimed = !!reward.transaction_id;

  return (
    <section className="card">
      <div className="card__inner">
        <div className="card__title-primary">
          <CreditAmount amount={reward.reward_amount} />
          <h3>{reward.reward_title}</h3>
        </div>
        <div className="card__content">{reward.reward_description}</div>
        <div className="card__actions card__actions--bottom ">
          {reward.reward_type == rewards.TYPE_REFERRAL &&
            <Link
              button="alt"
              navigate="/invite"
              label={__("Go To Invites")}
            />}
          {reward.reward_type !== rewards.TYPE_REFERRAL &&
            (claimed
              ? <span><Icon icon="icon-check" /> {__("Reward claimed.")}</span>
              : <RewardLink button="alt" reward_type={reward.reward_type} />)}
        </div>
      </div>
    </section>
  );
};

export default RewardTile;
