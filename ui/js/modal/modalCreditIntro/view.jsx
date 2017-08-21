import React from "react";
import { Modal } from "modal/modal";
import { CreditAmount, CurrencySymbol } from "component/common";
import Link from "component/link/index";
import { formatCredits } from "utils";

const ModalCreditIntro = props => {
  const { closeModal, currentBalance, totalRewardValue, verifyAccount } = props;

  const totalRewardRounded = Math.round(totalRewardValue / 10) * 10;

  return (
    <Modal type="custom" isOpen={true} contentLabel="Welcome to LBRY">
      <section>
        <h3 className="modal__header">{__("Quick Credit Intro")}</h3>
        <p>
          The LBRY network is controlled and powered by credits called{" "}
          <em><CurrencySymbol /></em>, a blockchain asset. {" "}
          <CurrencySymbol />{" "}
          {__(
            "is used to publish content, to have a say in the network rules, and to access paid content."
          )}
        </p>
        <p>
          {__("New verified users automatically receive more than ")} {" "}
          {totalRewardValue
            ? <CreditAmount amount={totalRewardRounded} />
            : <span className="credit-amount">{__("credits")}</span>}
          {" "} {__(" in rewards for usage and influence of the network.")}
        </p>
        {currentBalance <= 0
          ? <p>
              <strong>
                {__(
                  "Without any credits, you will not be able to take this action."
                )}
              </strong>
            </p>
          : <p>
              {__(
                "But you probably knew all this, since you've already got %s of them!",
                formatCredits(currentBalance, 2)
              )}
            </p>}

        <div className="modal__buttons">
          <Link
            button="primary"
            onClick={verifyAccount}
            label={__("You Had Me At Free LBC")}
          />
          <Link
            button="alt"
            onClick={closeModal}
            label={
              currentBalance <= 0
                ? __("Continue Without LBC")
                : __("Meh, Not Now")
            }
          />
        </div>
      </section>
    </Modal>
  );
};

export default ModalCreditIntro;
