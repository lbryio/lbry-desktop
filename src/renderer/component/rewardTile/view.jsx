// @flow
import React from 'react';
import CreditAmount from 'component/common/credit-amount';
import Icon from 'component/common/icon';
import RewardLink from 'component/rewardLink';
import Button from 'component/link';
import rewards from 'rewards';

type Props = {
  reward: {
    id: string,
    reward_title: string,
    reward_amount: number,
    transaction_id: string,
    created_at: string,
    reward_description: string,
    reward_type: string,
  },
};

const RewardTile = (props: Props) => {
  const { reward } = props;
  const claimed = !!reward.transaction_id;

  return (
    <section className="card card--section">
      <div className="card__title">
        {reward.reward_title}
      </div>
      <div className="card__subtitle">
        {reward.reward_description}
      </div>
      <div className="card__actions">
        {reward.reward_type === rewards.TYPE_REFERRAL && (
          <Button button="primary" navigate="/invite" label={__('Go To Invites')} />
        )}
        {reward.reward_type !== rewards.TYPE_REFERRAL &&
          (claimed ? (
            <span>
              <Icon icon="icon-check" /> {__('Reward claimed.')}
            </span>
          ) : (
            <RewardLink reward_type={reward.reward_type} />
          ))}
      </div>
    </section>
  );
};

export default RewardTile;
