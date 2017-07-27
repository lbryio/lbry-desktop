import React from "react";
import Link from "component/link";
import { FormRow } from "component/form";

const WalletSend = props => {
  const { sendToAddress, setAmount, setAddress, amount, address } = props;

  return (
    <section className="card">
      <form onSubmit={sendToAddress}>
        <div className="card__title-primary">
          <h3>{__("Send Credits")}</h3>
        </div>
        <div className="card__content">
          <FormRow
            label={__("Amount")}
            postfix={__("LBC")}
            step="0.01"
            type="number"
            placeholder="1.23"
            size="10"
            onChange={setAmount}
            value={amount}
          />
        </div>
        <div className="card__content">
          <FormRow
            label={__("Recipient Address")}
            placeholder="bbFxRyXXXXXXXXXXXZD8nE7XTLUxYnddTs"
            type="text"
            size="60"
            onChange={setAddress}
            value={address}
          />
        </div>
        <div className="card__actions card__actions--form-submit">
          <Link
            button="primary"
            label={__("Send")}
            onClick={sendToAddress}
            disabled={!(parseFloat(amount) > 0.0) || !address}
          />
          <input type="submit" className="hidden" />
        </div>
      </form>
    </section>
  );
};

export default WalletSend;
