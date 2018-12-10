// @flow
import React from 'react';
import ButtonTransaction from 'component/common/transaction-link';
import moment from 'moment';

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
      <header className="card__header">
        <h2 className="card__title">Claimed Rewards</h2>
      </header>

      <table className="card__content table table--stretch">
        <thead>
          <tr>
            <th>{__('Title')}</th>
            <th>{__('Amount')}</th>
            <th>{__('Transaction')}</th>
            <th>{__('Date')}</th>
          </tr>
        </thead>
        <tbody>
          {rewards.reverse().map(reward => (
            <tr key={reward.id}>
              <td>{reward.reward_title}</td>
              <td>{reward.reward_amount}</td>
              <td>
                <ButtonTransaction id={reward.transaction_id} />
              </td>
              <td>{moment(reward.created_at).format('LLL')}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </section>
  );
};

export default RewardListClaimed;
