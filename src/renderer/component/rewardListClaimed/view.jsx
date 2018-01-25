// @flow
import React from 'react';
import LinkTransaction from 'component/linkTransaction';

type Reward = {
  id: string,
  reward_title: string,
  reward_amount: number,
  transaction_id: string,
  created_at: string,
};

type Props = {
  rewards: Array<Reward>,
};

const RewardListClaimed = (props: Props) => {
  const { rewards } = props;

  if (!rewards || !rewards.length) {
    return null;
  }

  return (
    <section className="card card--section">
      <div className="card__title-identity">
        <h3>Claimed Rewards</h3>
      </div>
      <div className="card__content">
        <table className="table-standard table-stretch">
          <thead>
            <tr>
              <th>{__('Title')}</th>
              <th>{__('Amount')}</th>
              <th>{__('Transaction')}</th>
              <th>{__('Date')}</th>
            </tr>
          </thead>
          <tbody>
            {rewards.map(reward => (
              <tr key={reward.id}>
                <td>{reward.reward_title}</td>
                <td>{reward.reward_amount}</td>
                <td>
                  <LinkTransaction id={reward.transaction_id} />
                </td>
                <td>{reward.created_at.replace('Z', ' ').replace('T', ' ')}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
};

export default RewardListClaimed;
