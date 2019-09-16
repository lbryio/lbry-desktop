// @flow
import React from 'react';
import Button from 'component/button';

type Reward = {
  reward_amount: number,
  reward_range: string,
};

type Props = {
  isPending: boolean,
  label: ?string,
  reward: Reward,
  button: ?boolean,
  claimReward: Reward => void,
};

const RewardLink = (props: Props) => {
  const { reward, claimReward, label, isPending, button } = props;
  let displayLabel = label;
  if (isPending) {
    displayLabel = __('Claiming...');
  } else if (label) {
    displayLabel = label;
  } else if (reward && reward.reward_range && reward.reward_range.includes('-')) {
    displayLabel = `${__('Get')} ${reward.reward_range} LBC`;
  } else if (reward && reward.reward_amount > 0) {
    displayLabel = `${__('Get')} ${reward.reward_amount} LBC`;
  } else {
    displayLabel = __('Get ??? LBC');
  }

  return !reward ? null : (
    <Button
      button={button ? 'primary' : 'link'}
      disabled={isPending}
      label={displayLabel}
      onClick={() => {
        claimReward(reward);
      }}
    />
  );
};

export default RewardLink;
