import React from 'react';
import lbryio from 'lbryio';
import {CreditAmount, Icon} from 'component/common';
import SubHeader from 'component/subHeader'
import RewardLink from 'component/rewardLink';

const RewardTile = (props) => {
  const {
    reward,
  } = props

  const claimed = !!reward.transaction_id

  return (
    <section className="card">
      <div className="card__inner">
        <div className="card__title-primary">
          <CreditAmount amount={reward.reward_amount} />
          <h3>{reward.title}</h3>
        </div>
        <div className="card__actions">
          {claimed
            ? <span><Icon icon="icon-check" /> Reward claimed.</span>
            : <RewardLink reward={reward} />}
        </div>
        <div className="card__content">{reward.reward_description}</div>
      </div>
    </section>
  )
}

const RewardsPage = (props) => {
  const {
    fetching,
    rewards,
  } = props

  let content

  if (fetching) content = <div className="empty">Fetching rewards</div>
  if (!fetching && rewards.length == 0) content = <div className="empty">Failed to load rewards.</div>
  if (!fetching && rewards.length > 0) {
    content = rewards.map(reward => <RewardTile key={reward.reward_type} reward={reward} />)
  }

  return (
    <main className="main--single-column">
      <SubHeader />
      {content}
    </main>
  )
}

export default RewardsPage;
