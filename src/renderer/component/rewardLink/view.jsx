import React from 'react';
import Modal from 'modal/modal';
import Button from 'component/button';

const RewardLink = props => {
  const { reward, button, claimReward, clearError, errorMessage, label, isPending } = props;

  return !reward ? null : (
    <div className="reward-link">
      <Button
        button="primary"
        disabled={isPending}
        label={isPending ? __('Claiming...') : label || `${__('Get')} ${reward.reward_amount} LBC`}
        onClick={() => {
          claimReward(reward);
        }}
      />
      {errorMessage ? (
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
