// @flow
import React from 'react';
import Icon from 'component/common/icon';
import RewardLink from 'component/rewardLink';
import { rewards } from 'lbryinc';
import * as icons from 'constants/icons';

type Props = {
  invitees: ?Array<{
    email: string,
    invite_accepted: boolean,
    invite_reward_claimed: boolean,
    invite_reward_claimable: boolean,
  }>,
};

class InviteList extends React.PureComponent<Props> {
  render() {
    const { invitees } = this.props;

    if (!invitees) {
      return null;
    }

    return (
      <section className="card card--section">
        <header className="card__header">
          <h2 className="card__title">{__('Invite History')}</h2>
        </header>

        <div className="card__content">
          {invitees.length === 0 && (
            <span className="empty">{__("You haven't invited anyone.")} </span>
          )}
          {invitees.length > 0 && (
            <table className="table table--stretch">
              <thead>
                <tr>
                  <th>{__('Invitee Email')}</th>
                  <th className="text-center">{__('Invite Status')}</th>
                  <th className="text-center">{__('Reward')}</th>
                </tr>
              </thead>
              <tbody>
                {invitees.map(invitee => (
                  <tr key={invitee.email}>
                    <td>{invitee.email}</td>
                    <td className="text-center">
                      {invitee.invite_accepted ? (
                        <Icon icon={icons.CHECK} />
                      ) : (
                        <span className="empty">{__('unused')}</span>
                      )}
                    </td>
                    <td className="text-center">
                      {invitee.invite_reward_claimed ? (
                        <Icon icon={icons.CHECK} />
                      ) : invitee.invite_reward_claimable ? (
                        <RewardLink label={__('claim')} reward_type={rewards.TYPE_REFERRAL} />
                      ) : (
                        <span className="empty">{__('unclaimable')}</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>

        <div className="card__content">
          <div className="help">
            {__(
              'The maximum number of invite rewards is currently limited. Invite reward can only be claimed if the invitee passes the humanness test.'
            )}
          </div>
        </div>
      </section>
    );
  }
}

export default InviteList;
