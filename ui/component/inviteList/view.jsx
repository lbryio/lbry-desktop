// @flow
import React from 'react';
import RewardLink from 'component/rewardLink';
import Icon from 'component/common/icon';
import * as ICONS from 'constants/icons';
import Card from 'component/common/card';
import LbcMessage from 'component/common/lbc-message';

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
      { email: 'hello@odysee.com' }
    );

    if (referralReward) {
      rewardAmount = referralReward.reward_amount;
      rewardHelp = referralReward.reward_description;
    }
    const showClaimable = invitees.some((invite) => invite.invite_reward_claimable && !invite.invite_reward_claimed);

    return (
      <Card
        title={<div className="table__header-text">{__('Invite History')}</div>}
        subtitle={
          <div className="table__header-text">
            <LbcMessage>{rewardHelp}</LbcMessage>
          </div>
        }
        titleActions={
          referralReward &&
          showClaimable && (
            <div className="card__actions--inline">
              <RewardLink
                button
                label={__(`Claim Your %reward_amount% Credit Invite Reward`, { reward_amount: rewardAmount })}
                claim_code={referralReward.claim_code}
              />
            </div>
          )
        }
        isBodyList
        body={
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
                {invitees.map((invitee) => (
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
        }
      />
    );
  }
}

export default InviteList;
