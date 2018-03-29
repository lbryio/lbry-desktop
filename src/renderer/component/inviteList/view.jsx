import React from 'react';
import Icon from 'component/common/icon';
import RewardLink from 'component/rewardLink';
import rewards from 'rewards.js';
import * as icons from 'constants/icons';

class InviteList extends React.PureComponent {
  render() {
    const { invitees } = this.props;

    if (!invitees) {
      return null;
    }

    return (
      <section className="card card--section">
        <div className="card__title">
          <h3>{__('Invite History')}</h3>
        </div>
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
                {invitees.map((invitee, index) => (
                  <tr key={index}>
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
