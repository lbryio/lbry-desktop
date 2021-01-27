// @flow
import * as ICONS from 'constants/icons';
import React from 'react';
import Icon from 'component/common/icon';
import RewardLink from 'component/rewardLink';
import Button from 'component/button';
import Card from 'component/common/card';
import rewards from 'rewards';
import LbcMessage from 'component/common/lbc-message';

type Props = {
  openRewardCodeModal: () => void,
  openSetReferrerModal: () => void,
  reward: {
    id: string,
    reward_title: string,
    reward_amount: number,
    reward_range?: string,
    transaction_id: string,
    created_at: string,
    reward_description: string,
    reward_type: string,
    claim_code: string,
  },
  user: User,
};

const RewardTile = (props: Props) => {
  const { reward, openRewardCodeModal, openSetReferrerModal, user } = props;
  const referrerSet = user && user.invited_by_id;
  const claimed = !!reward.transaction_id;
  const customActionsRewards = [rewards.TYPE_REFERRAL, rewards.TYPE_REFEREE];

  return (
    <Card
      title={__(reward.reward_title)}
      subtitle={<LbcMessage>{reward.reward_description}</LbcMessage>}
      actions={
        <div className="section__actions">
          {reward.reward_type === rewards.TYPE_GENERATED_CODE && (
            <Button button="primary" onClick={openRewardCodeModal} label={__('Enter Code')} />
          )}
          {reward.reward_type === rewards.TYPE_REFERRAL && (
            <Button button="primary" navigate="/$/invite" label={__('Go To Invites')} />
          )}
          {reward.reward_type === rewards.TYPE_REFEREE && (
            <>
              {referrerSet && <RewardLink button reward_type={reward.reward_type} />}
              <Button
                button={referrerSet ? 'link' : 'primary'}
                onClick={openSetReferrerModal}
                label={referrerSet ? __('Change Inviter') : __('Set Inviter')}
              />
            </>
          )}
          {!customActionsRewards.some(i => i === reward.reward_type) &&
            (claimed ? (
              <span>
                <Icon icon={ICONS.COMPLETED} /> {__('Reward claimed.')}
              </span>
            ) : (
              <RewardLink button claim_code={reward.claim_code} />
            ))}
        </div>
      }
    />
  );
};

export default RewardTile;
