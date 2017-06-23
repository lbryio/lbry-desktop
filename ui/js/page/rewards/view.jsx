import React from "react";
import lbryio from "lbryio";
import { BusyMessage, CreditAmount, Icon } from "component/common";
import SubHeader from "component/subHeader";
import Auth from "component/auth";
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

    if (!fetching && Object.keys(rewards).length < 1) fetchRewards();
  }

  render() {
    const {
      fetching,
      isEligible,
      isVerificationCandidate,
      hasEmail,
      rewards,
    } = this.props;

    let content,
      isCard = false;

    if (!hasEmail || isVerificationCandidate) {
      content = (
        <div>
          <p>
            {__(
              "Additional information is required to be eligible for the rewards program."
            )}
          </p>
          <Auth />
        </div>
      );
      isCard = true;
    } else if (!isEligible) {
      isCard = true;
      content = (
        <div className="empty">
          <p>{__("You are not eligible to claim rewards.")}</p>
          <p>
            {__("To become eligible, email")}
            {" "}<Link href="mailto:help@lbry.io" label="help@lbry.io" />{" "}
            {__("with a link to a public social media profile.")}
          </p>
        </div>
      );
    } else if (fetching) {
      content = <BusyMessage message={__("Fetching rewards")} />;
    } else if (rewards.length > 0) {
      content = rewards.map(reward =>
        <RewardTile key={reward.reward_type} reward={reward} />
      );
    } else {
      content = <div className="empty">{__("Failed to load rewards.")}</div>;
    }

    return (
      <main className="main--single-column">
        <SubHeader />
        {isCard
          ? <section className="card">
              <div className="card__content">
                {content}
              </div>
            </section>
          : content}
      </main>
    );
  }
}

export default RewardsPage;
