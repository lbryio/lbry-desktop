import React from "react";
import { Icon } from "component/common";
import Modal from "component/modal";
import Link from "component/link";

const RewardLink = props => {
  const {
    reward,
    button,
    claimReward,
    clearError,
    errorMessage,
    isClaimed,
    isPending,
  } = props;

  return (
    <div className="reward-link">
      {isClaimed
        ? <span><Icon icon="icon-check" /> Reward claimed.</span>
        : <Link
            button={button ? button : "alt"}
            disabled={isPending}
            label={isPending ? "Claiming..." : "Claim Reward"}
            onClick={() => {
              claimReward(reward);
            }}
          />}
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
