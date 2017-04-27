import React from 'react';
import lbry from '../lbry.js';
import lbryio from '../lbryio.js';
import {CreditAmount, Icon} from '../component/common.js';
import rewards from '../rewards.js';
import Modal from '../component/modal.js';
import {WalletNav} from './wallet.js';
import {RewardLink} from '../component/link.js';

const RewardTile = React.createClass({
  propTypes: {
    type: React.PropTypes.string.isRequired,
    title: React.PropTypes.string.isRequired,
    description: React.PropTypes.string.isRequired,
    claimed: React.PropTypes.bool.isRequired,
    value: React.PropTypes.number.isRequired,
    onRewardClaim: React.PropTypes.func
  },
  render: function() {
    return (
      <section className="card">
        <div className="card__inner">
          <div className="card__title-primary">
            <CreditAmount amount={this.props.value} />
            <h3>{this.props.title}</h3>
          </div>
          <div className="card__actions">
            {this.props.claimed
              ? <span><Icon icon="icon-check" /> Reward claimed.</span>
              : <RewardLink {...this.props} />}
          </div>
          <div className="card__content">{this.props.description}</div>
        </div>
      </section>
    );
  }
});

var RewardsPage = React.createClass({
  componentWillMount: function() {
    this.loadRewards()
  },
  getInitialState: function() {
    return {
      userRewards: null,
      failed: null
    };
  },
  loadRewards: function() {
    lbryio.call('reward', 'list', {}).then((userRewards) => {
      this.setState({
        userRewards: userRewards,
      });
    }, () => {
      this.setState({failed: true })
    });
  },
  render: function() {
    return (
      <main className="constrained-page">
        <WalletNav viewingPage="rewards"/>
        <div>
          {!this.state.userRewards
            ? (this.state.failed ? <div className="empty">Failed to load rewards.</div> : '')
            : this.state.userRewards.map(({RewardType, RewardTitle, RewardDescription, TransactionID, RewardAmount}) => {
              return <RewardTile key={RewardType} onRewardClaim={this.loadRewards} type={RewardType} title={RewardTitle} description={RewardDescription} claimed={!!TransactionID} value={RewardAmount} />;
            })}
        </div>
      </main>
    );
  }
});

export default RewardsPage;
