// @flow
import * as PAGES from 'constants/pages';
import React, { PureComponent, Fragment } from 'react';
import BusyIndicator from 'component/common/busy-indicator';
import RewardListClaimed from 'component/rewardListClaimed';
import RewardTile from 'component/rewardTile';
import Button from 'component/button';
import Page from 'component/page';
import classnames from 'classnames';
import { rewards as REWARD_TYPES } from 'lbryinc';

type Props = {
  doAuth: () => void,
  fetchRewards: () => void,
  fetching: boolean,
  rewards: Array<Reward>,
  claimed: Array<Reward>,
  user: ?{
    is_identity_verified: boolean,
    is_reward_approved: boolean,
    primary_email: string,
    has_verified_email: boolean,
  },
  daemonSettings: {
    share_usage_data: boolean,
  },
};

class RewardsPage extends PureComponent<Props> {
  componentDidMount() {
    this.props.fetchRewards();
  }
  renderPageHeader() {
    const { user, daemonSettings } = this.props;

    if (user && !user.is_reward_approved && daemonSettings && daemonSettings.share_usage_data) {
      if (!user.primary_email || !user.has_verified_email || !user.is_identity_verified) {
        return (
          !IS_WEB && (
            <section className="card card--section">
              <h2 className="card__title">{__('Sign In To Unlock Rewards')}</h2>
              <p className="card__subtitle">
                {__(
                  'This is optional. You can continue to use this app without rewards, but LBC may be needed for some tasks.'
                )}
              </p>

              <Button
                navigate={`/$/${PAGES.AUTH}?redirect=/$/${PAGES.REWARDS}`}
                button="primary"
                label={__('Unlock Rewards')}
              />
            </section>
          )
        );
      }
      return (
        <section className="card card--section">
          <p>
            {__('This account must undergo review before you can participate in the rewards program.')}{' '}
            {__('This can take anywhere from several minutes to several days.')}
          </p>

          <p>{__('We apologize for this inconvenience, but have added this additional step to prevent fraud.')}</p>
          <p>
            {`${__('If you continue to see this message, send us an email to help@lbry.com.')} ${__(
              'Please enjoy free content in the meantime!'
            )}`}
          </p>
          <div className="card__actions">
            <Button navigate="/" button="primary" label="Return Home" />
          </div>
        </section>
      );
    }

    return null;
  }

  renderCustomRewardCode() {
    return (
      <RewardTile
        key={REWARD_TYPES.TYPE_GENERATED_CODE}
        reward={{
          reward_type: REWARD_TYPES.TYPE_GENERATED_CODE,
          reward_title: __('Custom Code'),
          reward_description: __('Are you a supermodel or rockstar that received a custom reward code? Claim it here.'),
        }}
      />
    );
  }

  renderUnclaimedRewards() {
    const { fetching, rewards, user, daemonSettings, claimed } = this.props;

    if (!IS_WEB && daemonSettings && !daemonSettings.share_usage_data) {
      return (
        <section className="card card--section">
          <h2 className="card__title">{__('Disabled')}</h2>
          <p className="card__subtitle">
            {__('Rewards are currently disabled for your account. Turn on diagnostic data sharing, in')}{' '}
            <Button button="link" navigate="/$/settings" label="Settings" />
            {__(', in order to re-enable them.')}
          </p>
        </section>
      );
    } else if (fetching) {
      return <BusyIndicator message={__('Fetching rewards')} />;
    } else if (user === null) {
      return (
        <p className="help">{__('This application is unable to earn rewards due to an authentication failure.')}</p>
      );
    } else if (!rewards || rewards.length <= 0) {
      return (
        <Fragment>
          <section className="card card--section">
            <h2 className="card__title">{__('No Rewards Available')}</h2>
            <p>
              {claimed && claimed.length
                ? __(
                    "You have claimed all available rewards! We're regularly adding more so be sure to check back later."
                  )
                : __('There are no rewards available at this time, please check back later.')}
            </p>
          </section>

          <div className="card__list">{this.renderCustomRewardCode()}</div>
        </Fragment>
      );
    }

    const isNotEligible = !user || !user.primary_email || !user.has_verified_email || !user.is_reward_approved;

    return (
      <div
        className={classnames('card__list', {
          'card--disabled': isNotEligible,
        })}
      >
        {rewards.map(reward => (
          <RewardTile key={reward.claim_code} reward={reward} />
        ))}
        {this.renderCustomRewardCode()}
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
