import React from "react";
import { Modal } from "component/modal";
import { CreditAmount } from "component/common";

class ModalFirstReward extends React.PureComponent {
  render() {
    const { closeModal, reward } = this.props;

    return (
      <Modal
        type="alert"
        overlayClassName="modal-overlay modal-overlay--clear"
        isOpen={true}
        contentLabel={__("Welcome to LBRY")}
        onConfirmed={closeModal}
      >
        <section>
          <h3 className="modal__header">{__("About Your Reward")}</h3>
          <p>
            {__("You earned a reward of")}
            {" "}<CreditAmount amount={reward.reward_amount} label={false} />
            {" "}{__("LBRY credits, or")} <em>{__("LBC")}</em>.
          </p>
          <p>
            {__(
              "This reward will show in your Wallet momentarily, shown in the top right, probably while you are reading this message."
            )}
          </p>
          <p>
            {__(
              "LBC is used to compensate creators, to publish, and to have say in how the network works."
            )}
          </p>
          <p>
            {__(
              "No need to understand it all just yet! Try watching or downloading something next."
            )}
          </p>
          <p>
            {__(
              "Finally, pleaseh know that LBRY is an early beta and that it earns the name."
            )}
          </p>
        </section>
      </Modal>
    );
  }
}

export default ModalFirstReward;
