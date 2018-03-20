import React from 'react';
import { BusyMessage } from 'component/common';
import RewardListClaimed from 'component/rewardListClaimed';
import RewardTile from 'component/rewardTile';
import Link from 'component/link';
import Page from 'component/page';

class RewardsPage extends React.PureComponent {
  /*
    Below is broken for users who have claimed all rewards.

    It can safely be disabled since we fetch all rewards after authentication, but should be re-enabled once fixed.

   */
  // componentDidMount() {
  //   this.fetchRewards(this.props);
  // }
  //
  // componentWillReceiveProps(nextProps) {
  //   this.fetchRewards(nextProps);
  // }
  //
  // fetchRewards(props) {
  //   const { fetching, rewards, fetchRewards } = props;
  //
  //   if (!fetching && (!rewards || !rewards.length)) {
  //     fetchRewards();
  //   }
  // }

  renderPageHeader() {
    const { doAuth, navigate, user, daemonSettings } = this.props;

    if (user && !user.is_reward_approved && daemonSettings.share_usage_data) {
      if (!user.primary_email || !user.has_verified_email || !user.is_identity_verified) {
        return (
          <section className="card card--section">
            <div className="card__title-primary">
              <h3>{__('Humans Only')}</h3>
            </div>
            <div className="card__content empty">
              <p>
                {__('Rewards are for human beings only.')}{' '}
                {__("You'll have to prove you're one of us before you can claim any rewards.")}
              </p>
            </div>
            <div className="card__content">
              <Link onClick={doAuth} button="primary" label="Prove Humanity" />
            </div>
          </section>
        );
      }
      return (
        <div className="card__content">
          <p>
            {__(
              'This account must undergo review before you can participate in the rewards program.'
            )}{' '}
            {__('This can take anywhere from several minutes to several days.')}
          </p>

          <p>
            {__(
              'We apologize for this inconvenience, but have added this additional step to prevent fraud.'
            )}
          </p>
          <p>
            {`${__('If you continue to see this message, send us an email to help@lbry.io.')} ${__(
              'Please enjoy free content in the meantime!'
            )}`}
          </p>
          <p>
            <Link onClick={() => navigate('/discover')} button="primary" label="Return Home" />
          </p>
        </div>
      );
    }
  }

  renderUnclaimedRewards() {
    const { fetching, rewards, user, daemonSettings, navigate } = this.props;

    if (!daemonSettings.share_usage_data) {
      return (
        <div className="card__content empty">
          <p>
            {__(
              'Rewards are currently disabled for your account. Turn on diagnostic data sharing, in'
            )}{' '}
            <Link onClick={() => navigate('/settings')} label="Settings" />
            {__(', in order to re-enable them.')}
          </p>
        </div>
      );
    } else if (fetching) {
      return (
        <div className="card__content">
          <BusyMessage message={__('Fetching rewards')} />
        </div>
      );
    } else if (user === null) {
      return (
        <div className="card__content empty">
          <p>
            {__('This application is unable to earn rewards due to an authentication failure.')}
          </p>
        </div>
      );
    } else if (!rewards || rewards.length <= 0) {
      return (
        <div className="card__content empty">
          {__('There are no rewards available at this time, please check back later.')}
        </div>
      );
    }
    return (
      <div className="card__list card__list--rewards">
        {rewards.map(reward => <RewardTile key={reward.reward_type} reward={reward} />)}
      </div>
    );
  }

  render() {
    return (
      <Page>
        {this.renderPageHeader()}
        {this.renderUnclaimedRewards()}
        {<RewardListClaimed />}
      </Page>
    );
  }
}

export default RewardsPage;
