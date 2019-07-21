// @flow
import React from 'react';
import TotalBackground from './total-background.png';
import useTween from 'util/use-tween';

type Props = {
  rewards: Array<Reward>,
};

function RewardTotal(props: Props) {
  const { rewards } = props;
  const rewardTotal = rewards.reduce((acc, val) => acc + val.reward_amount, 0);
  const modifier = rewardTotal > 500 ? 1 : 15; // used to tweak the reward count speed
  const total = useTween(rewardTotal * modifier);
  const integer = Math.round(total * rewardTotal);

  return (
    <section className="card  card--section card--reward-total" style={{ backgroundImage: `url(${TotalBackground})` }}>
      {integer} LBC {__('Earned From Rewards')}
    </section>
  );
}

export default RewardTotal;
