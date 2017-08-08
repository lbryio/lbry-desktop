import React from "react";
import { Modal } from "component/modal";
import { CreditAmount } from "component/common";
import Link from "component/link";
import RewardLink from "component/rewardLink";

class ModalWelcome extends React.PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      isFirstScreen: true,
    };
  }

  render() {
    const { closeModal, totalRewardValue, verifyAccount } = this.props;

    const totalRewardRounded = Math.round(totalRewardValue / 10) * 10;

    return (
      <Modal type="custom" isOpen={true} contentLabel="Welcome to LBRY">
        {this.state.isFirstScreen &&
          <section>
            <h3 className="modal__header">{__("Welcome to LBRY")}</h3>
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
            <div className="modal__buttons">
              <Link
                button="primary"
                onClick={() => {
                  this.setState({ isFirstScreen: false });
                }}
                label={__("Continue")}
              />
            </div>
          </section>}
        {!this.state.isFirstScreen &&
          <section>
            <h3 className="modal__header">{__("Claim Your Credits")}</h3>
            <p>
              The LBRY network is controlled and powered by credits called{" "}
              <em>LBC</em>, a blockchain asset.
            </p>
            <p>
              {__("New patrons receive ")} {" "}
              {totalRewardValue
                ? <CreditAmount amount={totalRewardRounded} />
                : <span className="credit-amount">{__("credits")}</span>}
              {" "} {__("in rewards for usage and influence of the network.")}
            </p>
            <p>
              {__(
                "You'll also earn weekly bonuses for checking out the greatest new stuff."
              )}
            </p>
            <div className="modal__buttons">
              <Link
                button="primary"
                onClick={verifyAccount}
                label={__("You Had Me At Free LBC")}
              />
              <Link
                button="alt"
                onClick={closeModal}
                label={__("I Burn Money")}
              />
            </div>
          </section>}
      </Modal>
    );
  }
}

export default ModalWelcome;
