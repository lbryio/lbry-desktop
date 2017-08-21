import React from "react";
import Link from "component/link";
import { CreditAmount, BusyMessage } from "component/common";

const InviteSummary = props => {
  const { isPending, invitesRemaining } = props;

  return (
    <section className="card">
      <div className="card__title-primary">
        <h3>{__("Invites")}</h3>
      </div>
      <div className="card__content">
        {isPending && <BusyMessage message={__("Checking invite status")} />}
        {!isPending &&
          <p>
            {__n(
              "You have %d invite remaining.",
              "You have %d invites remaining.",
              invitesRemaining
            )}
          </p>}
      </div>
      <div className="card__content">
        <Link
          button={invitesRemaining > 0 ? "primary" : "text"}
          navigate="/invite"
          label={__("Go To Invites")}
        />
      </div>
    </section>
  );
};

export default InviteSummary;
