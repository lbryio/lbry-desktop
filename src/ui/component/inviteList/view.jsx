// @flow
import React from 'react';
import RewardLink from 'component/rewardLink';
import Yrbl from 'component/yrbl';
import { rewards } from 'lbryinc';
import Icon from 'component/common/icon';
import * as ICONS from 'constants/icons';

type Props = {
  invitees: ?Array<{
    email: string,
    invite_accepted: boolean,
    invite_reward_claimed: boolean,
    invite_reward_claimable: boolean,
  }>,
  referralReward: ?Reward,
};

class InviteList extends React.PureComponent<Props> {
  render() {
    const { invitees, referralReward } = this.props;

    if (!invitees) {
      return null;
    }

    if (!invitees.length) {
      return (
        <Yrbl
          type="happy"
          title={__('Power To The People')}
          subtitle={__(
            'LBRY is powered by the users. More users, more power… and with great power comes great responsibility.'
          )}
        />
      );
    }

    let rewardAmount = 0;
    let rewardHelp = __(
      "Woah, you have a lot of friends! You've claimed the maximum amount of referral rewards. Check back soon to see if more are available!."
    );

    if (referralReward) {
      rewardAmount = referralReward.reward_amount;
      rewardHelp = referralReward.reward_description;
    }
    const showClaimable = invitees.some(invite => invite.invite_reward_claimable && !invite.invite_reward_claimed);

    return (
      <section className="card">
        <div className="table__header">
          <h2 className="card__title">
            {__('Invite History')}
            {referralReward && showClaimable && (
              <RewardLink
                button
                label={__(`Claim Your ${rewardAmount} LBC Invite Reward`)}
                reward_type={rewards.TYPE_REFERRAL}
              />
            )}
          </h2>
          <p className="card__subtitle">{rewardHelp}</p>
        </div>

        <table className="table table--invites">
          <thead>
            <tr>
              <th>{__('Invitee Email')}</th>
              <th>{__('Invite Status')}</th>
              <th>{__('Reward')}</th>
            </tr>
          </thead>
          <tbody>
            {invitees.map(invitee => (
              <tr key={invitee.email}>
                <td>{invitee.email}</td>
                <td>
                  <span>{invitee.invite_accepted ? __('Accepted') : __('Not Accepted')}</span>
                </td>
                <td>
                  {invitee.invite_reward_claimed && (
                    <React.Fragment>
                      <span>{__('Claimed')}</span>
                      <Icon icon={ICONS.COMPLETE} />
                    </React.Fragment>
                  )}

                  {!invitee.invite_reward_claimed &&
                    (invitee.invite_reward_claimable ? <span>{__('Claimable')}</span> : __('Unclaimable'))}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>
    );
  }
}

export default InviteList;
