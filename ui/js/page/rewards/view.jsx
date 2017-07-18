import React from "react";
import { BusyMessage, CreditAmount, Icon } from "component/common";
import SubHeader from "component/subHeader";
import Link from "component/link";
import RewardLink from "component/rewardLink";

const RewardTile = props => {
  const { reward } = props;

  const claimed = !!reward.transaction_id;

  return (
    <section className="card">
      <div className="card__inner">
        <div className="card__title-primary">
          <CreditAmount amount={reward.reward_amount} />
          <h3>{reward.reward_title}</h3>
        </div>
        <div className="card__actions">
          {claimed
            ? <span><Icon icon="icon-check" /> {__("Reward claimed.")}</span>
            : <RewardLink reward_type={reward.reward_type} />}
        </div>
        <div className="card__content">{reward.reward_description}</div>
      </div>
    </section>
  );
};

class RewardsPage extends React.PureComponent {
  componentDidMount() {
    this.fetchRewards(this.props);
  }

  componentWillReceiveProps(nextProps) {
    this.fetchRewards(nextProps);
  }

  fetchRewards(props) {
    const { fetching, rewards, fetchRewards } = props;

    if (!fetching && (!rewards || !rewards.length)) {
      fetchRewards();
    }
  }

  render() {
    const {
      doAuth,
      fetching,
      isEligible,
      isVerificationCandidate,
      hasEmail,
      rewards,
      newUserReward,
    } = this.props;

    let content,
      isCard = false;

    if (!hasEmail || isVerificationCandidate) {
      content = (
        <div>
          <div className="card__content empty">
            <p>{__("Only verified accounts are eligible to earn rewards.")}</p>
          </div>
          <div className="card__content">
            <Link onClick={doAuth} button="primary" label="Become Verified" />
          </div>
        </div>
      );
      isCard = true;
    } else if (!isEligible) {
      isCard = true;
      content = (
        <div className="card__content empty">
          <p>{__("You are not eligible to claim rewards.")}</p>
        </div>
      );
    } else if (fetching) {
      content = (
        <div className="card__content">
          <BusyMessage message={__("Fetching rewards")} />
        </div>
      );
    } else if (rewards.length > 0) {
      content = (
        <div>
          {rewards.map(reward =>
            <RewardTile key={reward.reward_type} reward={reward} />
          )}
        </div>
      );
    } else {
      content = (
        <div className="card__content empty">
          {__("Failed to load rewards.")}
        </div>
      );
    }

    return (
      <main className="main--single-column">
        <SubHeader />
        {isCard ? <section className="card">{content}</section> : content}
      </main>
    );
  }
}

export default RewardsPage;
