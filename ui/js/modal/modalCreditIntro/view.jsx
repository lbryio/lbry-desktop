import React from "react";
import { Modal } from "modal/modal";
import { CreditAmount, CurrencySymbol } from "component/common";
import Link from "component/link/index";

const ModalCreditIntro = props => {
  const { closeModal, currentBalance, totalRewardValue, verifyAccount } = props;

  const totalRewardRounded = Math.round(totalRewardValue / 10) * 10;

  return (
    <Modal type="custom" isOpen={true} contentLabel="Welcome to LBRY">
      <section>
        <h3 className="modal__header">{__("Blockchain 101")}</h3>
        <p>
          LBRY is controlled and powered by a blockchain asset called {" "}
          <em><CurrencySymbol /></em>.{" "}
          <CurrencySymbol />{" "}
          {__(
            "is used to publish content, to have a say in the network rules, and to access paid content."
          )}
        </p>
        {currentBalance <= 0
          ? <div>
              <p>
                You currently have <CreditAmount amount={currentBalance} />, so
                the actions you can take are limited.
              </p>
              <p>
                However, there are a variety of ways to get credits, including
                more than {" "}
                {totalRewardValue
                  ? <CreditAmount amount={totalRewardRounded} />
                  : <span className="credit-amount">{__("?? credits")}</span>}
                {" "}{" "}
                {__(
                  " in rewards available for being a proven human during the LBRY beta."
                )}
              </p>
            </div>
          : <div>
              <p>
                But you probably knew this, since you've already got{" "}
                <CreditAmount amount={currentBalance} />.
              </p>
            </div>}

        <div className="modal__buttons">
          <Link
            button="primary"
            onClick={verifyAccount}
            label={__("I'm Totally A Human")}
          />
          <Link
            button="alt"
            onClick={closeModal}
            label={
              currentBalance <= 0 ? __("Use Without LBC") : __("Meh, Not Now")
            }
          />
        </div>
      </section>
    </Modal>
  );
};

export default ModalCreditIntro;
