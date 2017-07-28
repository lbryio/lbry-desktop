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
          <h3 className="modal__header">{__("Your First Reward")}</h3>
          <p>
            {__("You just earned your first reward of")}
            {" "}<CreditAmount amount={reward.reward_amount} />.
          </p>
          <p>
            {__(
              "This reward will show in your Wallet in the top right momentarily (if it hasn't already)."
            )}
          </p>
          <p>
            {__(
              "These credits are used to compensate creators, to publish your own content, and to have say in how the network works."
            )}
          </p>
          <p>
            {__(
              "No need to understand it all just yet! Try watching or downloading something next."
            )}
          </p>
          <p>
            {__(
              "Finally, please know that LBRY is an early beta and that it earns the name."
            )}
          </p>
        </section>
      </Modal>
    );
  }
}

export default ModalFirstReward;
