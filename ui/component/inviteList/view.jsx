// @flow
import React from 'react';
import RewardLink from 'component/rewardLink';
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

    if (!invitees || !invitees.length) {
      return null;
    }

    let rewardAmount = 0;
    let rewardHelp = __(
      "Woah, you have a lot of friends! You've claimed the maximum amount of invite rewards. Email %email% if you'd like to be whitelisted for more invites.",
      { email: 'hello@lbry.com' }
    );

    if (referralReward) {
      rewardAmount = referralReward.reward_amount;
      rewardHelp = referralReward.reward_description;
    }
    const showClaimable = invitees.some(invite => invite.invite_reward_claimable && !invite.invite_reward_claimed);

    return (
      <section className="card">
        <div className="table__header">
          <div className="table__header-text--between">
            <div>
              <h2 className="card__title">{__('Invite History')}</h2>
              <p className="section__subtitle">{rewardHelp}</p>
            </div>

            {referralReward && showClaimable && (
              <RewardLink
                button
                label={__(`Claim Your ${rewardAmount} Credit Invite Reward`)}
                claim_code={referralReward.claim_code}
              />
            )}
          </div>
        </div>

        <div className="table__wrapper">
          <table className="table section">
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
        </div>
      </section>
    );
  }
}

export default InviteList;
