// @flow
import React from 'react';
import { Modal } from 'modal/modal';
import Button from 'component/button';

type Reward = {
  reward_amount: number,
};

type Props = {
  isPending: boolean,
  label: ?string,
  errorMessage: ?string,
  reward: Reward,
  button: ?boolean,
  clearError: Reward => void,
  claimReward: Reward => void,
};

const RewardLink = (props: Props) => {
  const { reward, claimReward, clearError, errorMessage, label, isPending, button } = props;

  return !reward ? null : (
    <div className="reward-link">
      <Button
        button={button ? 'primary' : 'link'}
        disabled={isPending}
        label={isPending ? __('Claiming...') : label || `${__('Get')} ${reward.reward_amount} LBC`}
        onClick={() => {
          claimReward(reward);
        }}
      />
      {errorMessage ? (
        // TODO: This should be moved to redux
        <Modal
          isOpen
          contentLabel="Reward Claim Error"
          className="error-modal"
          onConfirmed={() => {
            clearError(reward);
          }}
        >
          {errorMessage}
        </Modal>
      ) : (
        ''
      )}
    </div>
  );
};

export default RewardLink;
