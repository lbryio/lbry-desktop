import React from "react";
import LinkTransaction from "component/linkTransaction";

const RewardListClaimed = props => {
  const { rewards } = props;

  if (!rewards || !rewards.length) {
    return null;
  }

  return (
    <section className="card">
      <div className="card__title-identity"><h3>Claimed Rewards</h3></div>
      <div className="card__content">
        <table className="table-standard table-stretch">
          <thead>
            <tr>
              <th>{__("Title")}</th>
              <th>{__("Amount")}</th>
              <th>{__("Transaction")}</th>
              <th>{__("Date")}</th>
            </tr>
          </thead>
          <tbody>
            {rewards.map(reward => {
              return (
                <tr key={reward.id}>
                  <td>{reward.reward_title}</td>
                  <td>{reward.reward_amount}</td>
                  <td><LinkTransaction id={reward.transaction_id} /></td>
                  <td>
                    {reward.created_at.replace("Z", " ").replace("T", " ")}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </section>
  );
};

export default RewardListClaimed;
