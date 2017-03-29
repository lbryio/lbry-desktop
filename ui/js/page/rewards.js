import React from 'react';
import lbry from '../lbry.js';
import {CreditAmount} from '../component/common.js';
import Modal from '../component/modal.js';
import {Link} from '../component/link.js';
import lbryio from '../lbryio.js';

const RewardTile = React.createClass({
  propTypes: {
    name: React.PropTypes.string.isRequired,
    title: React.PropTypes.string.isRequired,
    description: React.PropTypes.string.isRequired,
    claimed: React.PropTypes.bool.isRequired,
    value: React.PropTypes.number.isRequired,
  },
  render: function() {
    return (
      <section className="card">
        <div className={"row-fluid card-content"}>
          <h3><Link label={this.props.title} href={'?reward=' + this.props.name} /></h3>
          <CreditAmount amount={this.props.value} />
          <section>{this.props.description}</section>
          {this.props.claimed
              ? <span className="empty">This reward has been claimed.</span>
              : <Link button="primary" label="Start reward" href={'?reward=' + this.props.name} />}
        </div>
      </section>
    );
  }
});

var RewardsPage = React.createClass({
  componentWillMount: function() {
    lbryio.call('reward_type', 'list', {}).then((rewardTypes) => {
      this.setState({
        rewardTypes: rewardTypes,
      });
    });
  },
  getInitialState: function() {
    return {
      rewardTypes: null,
    };
  },
  render: function() {
    return (
      <main>
        <form onSubmit={this.handleSubmit}>
          <div className="card">
            <h2>Rewards</h2>
            {!this.state.rewardTypes
              ? null
              : this.state.rewardTypes.map(({name, title, description, claimed, value}) => {
                return <RewardTile key={name} name={name} title={title} description={description} claimed={claimed} value={value} />;
              })}
          </div>
        </form>
      </main>
    );
  }
});

export default RewardsPage;
