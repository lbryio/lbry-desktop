// @flow
import React from 'react';
import ButtonTransaction from 'component/common/transaction-link';
import moment from 'moment';
import LbcSymbol from 'component/common/lbc-symbol';
import Card from 'component/common/card';

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
    <Card
      title={<div className="table__header-text">{__('Claimed Rewards')}</div>}
      subtitle={
        <div className="table__header-text">
          {__(
            'Reward history is tied to your email. In case of lost or multiple wallets, your balance may differ from the amounts claimed'
          )}
        </div>
      }
      isBodyList
      body={
        <div className="table__wrapper">
          <table className="table table--rewards">
            <thead>
              <tr>
                <th>{__('Title')}</th>
                <th>
                  <LbcSymbol size={20} />
                </th>
                <th>{__('Transaction')}</th>
                <th>{__('Date')}</th>
              </tr>
            </thead>
            <tbody>
              {rewards.reverse().map(reward => (
                <tr key={reward.id}>
                  <td>{reward.reward_title}</td>
                  <td>{reward.reward_amount}</td>
                  <td>{reward.transaction_id && <ButtonTransaction id={reward.transaction_id} />}</td>
                  <td>{moment(reward.created_at).format('LLL')}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      }
    />
  );
};

export default RewardListClaimed;
