// @flow
import * as PAGES from 'constants/pages';
import React, { PureComponent } from 'react';
import BusyIndicator from 'component/common/busy-indicator';
import RewardListClaimed from 'component/rewardListClaimed';
import RewardTile from 'component/rewardTile';
import Button from 'component/button';
import Page from 'component/page';
import classnames from 'classnames';
import REWARD_TYPES from 'rewards';
import RewardAuthIntro from 'component/rewardAuthIntro';
import Card from 'component/common/card';
import I18nMessage from 'component/i18nMessage';
import { SITE_HELP_EMAIL, SITE_NAME } from 'config';

type Props = {
  doAuth: () => void,
  fetchRewards: () => void,
  fetchUser: () => void,
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
    const { user, fetchUser, fetchRewards } = this.props;
    const rewardsApproved = user && user.is_reward_approved;

    fetchRewards();
    if (!rewardsApproved) {
      fetchUser();
    }
  }

  renderPageHeader() {
    const { user, daemonSettings, fetchUser } = this.props;
    const rewardsEnabled = IS_WEB || (daemonSettings && daemonSettings.share_usage_data);

    if (user && !user.is_reward_approved && rewardsEnabled) {
      if (!user.primary_email || !user.has_verified_email || !user.is_identity_verified) {
        return (
          <div className="section">
            <RewardAuthIntro />
          </div>
        );
      }

      return (
        <Card
          className="section"
          title={__('Reward validation pending')}
          body={
            <React.Fragment>
              <p>
                {__(
                  'This account must undergo review before you can participate in the rewards program. Not all users and regions may qualify.'
                )}{' '}
                {__('This can take anywhere from a few hours to several days. Please be patient.')}
              </p>

              <p>
                {__(
                  'We apologize for this inconvenience, but have added this additional step to prevent abuse. Users on VPN or shared connections will continue to see this message and are not eligible for Rewards.'
                )}
              </p>
              <p>
                <I18nMessage
                  tokens={{
                    rewards_faq: (
                      <Button
                        button="link"
                        label={__('Rewards FAQ')}
                        href="https://odysee.com/@OdyseeHelp:b/rewards-verification:3"
                      />
                    ),
                    help_email: SITE_HELP_EMAIL,
                    site_name: SITE_NAME,
                  }}
                >
                  Please review the %rewards_faq% for eligibility, and send us an email to %help_email% if you continue
                  to see this message. You can continue to use %site_name% without this feature.
                </I18nMessage>
                {`${__('Enjoy all the awesome free content in the meantime!')}`}
              </p>
            </React.Fragment>
          }
          actions={
            <div className="section__actions">
              <Button navigate="/" button="primary" label="Return Home" />
              <Button onClick={() => fetchUser()} button="link" label="Refresh" />
            </div>
          }
        />
      );
    }

    return null;
  }

  renderCustomRewardCode() {
    const { user } = this.props;
    const isNotEligible = !user || !user.primary_email || !user.has_verified_email || !user.is_reward_approved;
    return (
      <RewardTile
        key={REWARD_TYPES.TYPE_GENERATED_CODE}
        reward={{
          reward_type: REWARD_TYPES.TYPE_GENERATED_CODE,
          reward_title: __('Custom Code'),
          reward_description: __('Are you a supermodel or rockstar that received a custom reward code? Claim it here.'),
        }}
        disabled={isNotEligible}
      />
    );
  }

  renderUnclaimedRewards() {
    const { fetching, rewards, user, daemonSettings, claimed } = this.props;

    if (!IS_WEB && daemonSettings && !daemonSettings.share_usage_data) {
      return (
        <section className="card card--section">
          <h2 className="card__title card__title--deprecated">{__('Rewards Disabled')}</h2>
          <p className="error__text">
            <I18nMessage tokens={{ settings: <Button button="link" navigate="/$/settings" label="Settings" /> }}>
              Rewards are currently disabled for your account. Turn on diagnostic data sharing, in %settings%, to
              re-enable them.
            </I18nMessage>
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
        <Card
          title={__('No rewards available')}
          subtitle={
            claimed && claimed.length
              ? __(
                  "You have claimed all available rewards! We're regularly adding more so be sure to check back later."
                )
              : __('There are no rewards available at this time, please check back later.')
          }
          actions={<Button button="primary" navigate={`/$/${PAGES.DISCOVER}`} label={__('Go Home')} />}
        />
      );
    }

    const isNotEligible = !user || !user.primary_email || !user.has_verified_email || !user.is_reward_approved;

    return (
      <div
        aria-hidden={isNotEligible}
        className={classnames('card__list', {
          'card--disabled': isNotEligible,
        })}
      >
        {rewards.map((reward) => (
          <RewardTile disabled={isNotEligible} key={reward.claim_code} reward={reward} />
        ))}
        {this.renderCustomRewardCode()}
      </div>
    );
  }

  render() {
    return (
      <Page>
        {this.renderPageHeader()}
        <div className="section">{this.renderUnclaimedRewards()}</div>
        <RewardListClaimed />
      </Page>
    );
  }
}

export default RewardsPage;
