// @flow
import * as ICONS from 'constants/icons';
import React from 'react';
import Icon from 'component/common/icon';
import RewardLink from 'component/rewardLink';
import Button from 'component/button';
import { rewards } from 'lbryinc';

type Props = {
  openRewardCodeModal: () => void,
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
  const { reward, openRewardCodeModal } = props;
  const claimed = !!reward.transaction_id;

  return (
    <section className="card card--section">
      <header className="card__header">
        <h2 className="card__title">{reward.reward_title}</h2>
        <p className="card__subtitle">{reward.reward_description}</p>
      </header>

      <div className="card__content">
        <div className="card__actions">
          {reward.reward_type === rewards.TYPE_GENERATED_CODE && (
            <Button button="primary" onClick={openRewardCodeModal} label={__('Enter Code')} />
          )}
          {reward.reward_type === rewards.TYPE_REFERRAL && (
            <Button button="primary" navigate="/$/invite" label={__('Go To Invites')} />
          )}
          {reward.reward_type !== rewards.TYPE_REFERRAL &&
            (claimed ? (
              <span>
                <Icon icon={ICONS.COMPLETED} /> {__('Reward claimed.')}
              </span>
            ) : (
              <RewardLink button reward_type={reward.reward_type} />
            ))}
        </div>
      </div>
    </section>
  );
};

export default RewardTile;
