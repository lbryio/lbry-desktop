import React from "react";
import { Modal } from "component/modal";
import { CreditAmount } from "component/common";
import Link from "component/link";
import RewardLink from "component/rewardLink";

class ModalWelcome extends React.PureComponent {
  render() {
    const { closeModal, isRewardApproved, reward, verifyAccount } = this.props;

    return (
      <Modal type="custom" isOpen={true} contentLabel="Welcome to LBRY">
        <section>
          <h3 className="modal__header">{__("Welcome to LBRY.")}</h3>
          <p>
            {__(
              "Using LBRY is like dating a centaur. Totally normal up top, and"
            )}
            {" "}<em>{__("way different")}</em> {__("underneath.")}
          </p>
          <p>{__("Up top, LBRY is similar to popular media sites.")}</p>
          <p>
            {__(
              "Below, LBRY is controlled by users -- you -- via blockchain and decentralization."
            )}
          </p>
          <p>
            {__("Please have")} {" "}
            {reward &&
              <CreditAmount amount={parseFloat(reward.reward_amount)} />}
            {!reward && <span className="credit-amount">{__("??")}</span>}
            {" "} {__("as a thank you for building content freedom.")}
          </p>
          <div className="text-center">
            {isRewardApproved &&
              <RewardLink reward_type="new_user" button="primary" />}
            {!isRewardApproved &&
              <Link
                button="primary"
                onClick={verifyAccount}
                label={__("Get Welcome Credits")}
              />}
            <Link button="alt" onClick={closeModal} label={__("Skip")} />
          </div>
        </section>
      </Modal>
    );
  }
}

export default ModalWelcome;
