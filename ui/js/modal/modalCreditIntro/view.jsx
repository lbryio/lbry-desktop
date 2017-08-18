import React from "react";
import { Modal } from "modal/modal";
import { CreditAmount, CurrencySymbol } from "component/common";
import Link from "component/link/index";

const ModalCreditIntro = props => {
  const { closeModal, totalRewardValue, verifyAccount } = props;

  const totalRewardRounded = Math.round(totalRewardValue / 10) * 10;

  return (
    <Modal type="custom" isOpen={true} contentLabel="Welcome to LBRY">
      <section>
        <h3 className="modal__header">{__("Claim Your Credits")}</h3>
        <p>
          The LBRY network is controlled and powered by credits called{" "}
          <em><CurrencySymbol /></em>, a blockchain asset.
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
          <Link button="alt" onClick={closeModal} label={__("I Burn Money")} />
        </div>
      </section>
    </Modal>
  );
};

export default ModalCreditIntro;
