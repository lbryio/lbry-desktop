import React from "react";
import Modal from "modal/modal";
import Link from "component/link";

const RewardLink = props => {
  const {
    reward,
    button,
    claimReward,
    clearError,
    errorMessage,
    label,
    isPending,
  } = props;

  return (
    <div className="reward-link">
      <Link
        button={button}
        disabled={isPending}
        label={
          isPending ? __("Claiming...") : label ? label : __("Claim Reward")
        }
        onClick={() => {
          claimReward(reward);
        }}
      />
      {errorMessage
        ? <Modal
            isOpen={true}
            contentLabel="Reward Claim Error"
            className="error-modal"
            onConfirmed={() => {
              clearError(reward);
            }}
          >
            {errorMessage}
          </Modal>
        : ""}
    </div>
  );
};
export default RewardLink;
