import React from 'react';

// Placeholder for something like api.lbry.io/reward_type/get/[name] */
function apiRewardTypeGet(name) {
  return {
    name: 'reward1',
    title: 'Reward 1',
    description: 'Reward 1 description',
    value: 50,
    claimed: true,
  };
}

const RewardPage = React.createClass({
  propTypes: {
    name: React.PropTypes.string,
  },
  getInitialState: function() {
    return {
      rewardType: null,
    };
  },
  componentWillMount: function() {
    this.setState({
      rewardType: apiRewardTypeGet(this.props.name),
    });
  },
  render: function() {
    if (!this.state.rewardType) {
      return null;
    }

    let {title, description, value} = this.state.rewardType;
    return (
      <main>
        <section className="card">
          <h2>{title}</h2>
          <p>{description}</p>
          {/* Most likely have a component included here for each reward (e.g. WatchVideoReward) */}
        </section>
      </main>
    );
  }
});

export default RewardPage;
