import React from 'react';
import lbryio from 'lbryio';
import {BusyMessage, CreditAmount, Icon} from 'component/common';
import SubHeader from 'component/subHeader'
import Link from 'component/link'
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
          <h3>{reward.reward_title}</h3>
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
    isEligible,
    navigateToAuth,
    rewards,
  } = props

  let content

  if (!isEligible) {
    content = <div className="empty">
      You are not eligible to claim rewards. { ' ' }
      <Link onClick={navigateToAuth} label="Become eligible" />.
    </div>
  } else if (fetching) {
    content = <BusyMessage message="Fetching rewards" />
  } else if (rewards.length > 0) {
    content = rewards.map(reward => <RewardTile key={reward.reward_type} reward={reward} />)
  } else {
    content = <div className="empty">Failed to load rewards.</div>
  }

  return (
    <main className="main--single-column">
      <SubHeader />
      {content}
    </main>
  )
}

export default RewardsPage;
