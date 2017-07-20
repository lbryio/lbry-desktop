import React from "react";
import Modal from "component/modal";
import Link from "component/link";

const RewardLink = props => {
  const {
    reward,
    button,
    claimReward,
    clearError,
    errorMessage,
    isPending,
  } = props;

  return (
    <div className="reward-link">
      <Link
        button={button ? button : "alt"}
        disabled={isPending}
        label={isPending ? __("Claiming...") : __("Claim Reward")}
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
