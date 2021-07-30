// @flow
import React from 'react';
import Button from 'component/button';
import LbcMessage from 'component/common/lbc-message';

type Reward = {
  reward_amount: number,
  reward_range: string,
};

type Props = {
  isPending: boolean,
  label: ?string,
  reward: Reward,
  button: ?boolean,
  disabled: boolean,
  claimReward: (Reward) => void,
};

const RewardLink = (props: Props) => {
  const { reward, claimReward, label, isPending, button, disabled = false } = props;
  let displayLabel = label;
  if (isPending) {
    displayLabel = __('Claiming...');
  } else if (label) {
    displayLabel = label;
  } else if (reward && reward.reward_range && reward.reward_range.includes('-')) {
    displayLabel = __('Claim %range% LBC', { range: reward.reward_range });
  } else if (reward && reward.reward_amount > 0) {
    displayLabel = __('Claim %amount% LBC', { amount: reward.reward_amount });
  } else {
    displayLabel = __('Claim ??? LBC');
  }

  return !reward ? null : (
    <Button
      button={button ? 'primary' : 'link'}
      disabled={disabled || isPending}
      label={<LbcMessage>{displayLabel}</LbcMessage>}
      aria-label={displayLabel}
      onClick={() => {
        claimReward(reward);
      }}
    />
  );
};

export default RewardLink;
