// @flow
import React from 'react';
import Button from 'component/button';

type Reward = {
  reward_amount: number,
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
  return !reward ? null : (
    <Button
      button={button ? 'inverse' : 'link'}
      disabled={isPending}
      label={isPending ? __('Claiming...') : label || `${__('Get')} ${reward.reward_amount} LBC`}
      onClick={() => {
        claimReward(reward);
      }}
    />
  );
};

export default RewardLink;
