import React from "react";
import { Modal } from "component/modal";
import { CreditAmount } from "component/common";
import Link from "component/link";
import RewardLink from "component/rewardLink";

class WelcomeModal extends React.PureComponent {
  render() {
    const { closeModal, hasClaimed, isRewardApproved, reward } = this.props;

    return !hasClaimed
      ? <Modal type="custom" isOpen={true} contentLabel="Welcome to LBRY">
          <section>
            <h3 className="modal__header">Welcome to LBRY.</h3>
            <p>
              Using LBRY is like dating a centaur. Totally normal up top, and
              {" "}<em>way different</em> underneath.
            </p>
            <p>Up top, LBRY is similar to popular media sites.</p>
            <p>
              Below, LBRY is controlled by users -- you -- via blockchain and
              decentralization.
            </p>
            <p>
              Thank you for making content freedom possible!
              {" "}{isRewardApproved ? __("Here's a nickel, kid.") : ""}
            </p>
            <div className="text-center">
              {isRewardApproved
                ? <RewardLink reward_type="new_user" button="primary" />
                : <Link
                    button="primary"
                    onClick={closeModal}
                    label="Continue"
                  />}
            </div>
          </section>
        </Modal>
      : <Modal
          type="alert"
          overlayClassName="modal-overlay modal-overlay--clear"
          isOpen={true}
          contentLabel="Welcome to LBRY"
          onConfirmed={closeModal}
        >
          <section>
            <h3 className="modal__header">About Your Reward</h3>
            <p>
              You earned a reward of
              {" "}<CreditAmount amount={reward.reward_amount} label={false} />
              {" "}LBRY
              credits, or <em>LBC</em>.
            </p>
            <p>
              This reward will show in your Wallet momentarily, probably while
              you are reading this message.
            </p>
            <p>
              LBC is used to compensate creators, to publish, and to have say in
              how the network works.
            </p>
            <p>
              No need to understand it all just yet! Try watching or downloading
              something next.
            </p>
            <p>
              Finally, know that LBRY is an early beta and that it earns the
              name.
            </p>
          </section>
        </Modal>;
  }
}

export default WelcomeModal;
