import React from "react";
import { BusyMessage } from "component/common";
import RewardListClaimed from "component/rewardListClaimed";
import RewardTile from "component/rewardTile";
import SubHeader from "component/subHeader";
import Link from "component/link";

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

  renderPageHeader() {
    const { doAuth, navigate, user } = this.props;

    if (user && !user.is_reward_approved) {
      if (
        !user.primary_email ||
        !user.has_verified_email ||
        !user.is_identity_verified
      ) {
        return (
          <div>
            <div className="card__content empty">
              <p>
                {__("Only verified accounts are eligible to earn rewards.")}
              </p>
            </div>
            <div className="card__content">
              <Link onClick={doAuth} button="primary" label="Become Verified" />
            </div>
          </div>
        );
      } else {
        return (
          <div className="card__content">
            <p>
              {__(
                "This account must undergo review before you can participate in the rewards program."
              )}
              {" "}
              {__(
                "This can take anywhere from several minutes to several days."
              )}
            </p>

            <p>
              {__(
                "We apologize for this inconvenience, but have added this additional step to prevent fraud."
              )}
            </p>
            <p>
              {__("You will receive an email when this process is complete.") +
                " " +
                __("Please enjoy free content in the meantime!")}
            </p>
            <p>
              <Link
                onClick={() => navigate("/discover")}
                button="primary"
                label="Return Home"
              />
            </p>
          </div>
        );
      }
    }
  }

  renderUnclaimedRewards() {
    const { fetching, rewards, user } = this.props;

    if (fetching) {
      return (
        <div className="card__content">
          <BusyMessage message={__("Fetching rewards")} />
        </div>
      );
    } else if (user === null) {

      return (
        <div className="card__content empty">
          <p>
            {__(
                "This application is unable to earn rewards due to an authentication failure."
            )}
          </p>
        </div>
      );
    } else if (!rewards || rewards.length <= 0) {
      return (
        <div className="card__content empty">
          {__("Failed to load rewards.")}
        </div>
      );
    } else {
      return rewards.map(reward =>
        <RewardTile key={reward.reward_type} reward={reward} />
      );
    }
  }

  render() {
    return (
      <main className="main--single-column">
        <SubHeader />
        {this.renderPageHeader()}
        {this.renderUnclaimedRewards()}
        {<RewardListClaimed />}
      </main>
    );
  }
}

export default RewardsPage;
