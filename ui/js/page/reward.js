import React from 'react';
import lbryio from '../lbryio.js';
import {Link} from '../component/link.js';
import Notice from '../component/notice.js';
import {CreditAmount} from '../component/common.js';

const {shell} = require('electron');
const querystring = require('querystring');

const GITHUB_CLIENT_ID = '6baf581d32bad60519';

const LinkGithubReward = React.createClass({
  propTypes: {
    onClaimed: React.PropTypes.func,
  },
  _launchLinkPage: function() {
    /* const githubAuthParams = {
      client_id: GITHUB_CLIENT_ID,
      redirect_uri: 'https://lbry.io/',
      scope: 'user:email,public_repo',
      allow_signup: false,
    }
    shell.openExternal('https://github.com/login/oauth/authorize?' + querystring.stringify(githubAuthParams)); */
    shell.openExternal('https://lbry.io');
  },
  handleConfirmClicked: function() {
    this.setState({
      confirming: true,
    });

    lbry.get_new_address().then((address) => {
      lbryio.call('reward', 'new', {
        reward_type: 'new_developer',
        access_token: '**access token here**',
        wallet_address: address,
      }, 'post').then((response) => {
        console.log('response:', response);

        this.props.onClaimed(); // This will trigger another API call to show that we succeeded

        this.setState({
          confirming: false,
          error: null,
        });
      }, (error) => {
        console.log('failed with error:', error);
        this.setState({
          confirming: false,
          error: error,
        });
      });
    });
  },
  getInitialState: function() {
    return {
      confirming: false,
      error: null,
    };
  },
  render: function() {
    return (
      <section>
        <section className="reward-page__details">
          <p><Link button="alt" label="Link with GitHub" onClick={this._launchLinkPage} /></p>
          <p>This will open a browser window where you can authorize GitHub to link your account to LBRY. This will record your email (no spam) and star the LBRY repo.</p>
          <p>Once you're finished, you may confirm you've linked the account to receive your reward.</p>
        </section>
        {this.state.error
          ? <Notice isError>
              {this.state.error.message}
            </Notice>
          : null}

        <Link button="primary" label={this.state.confirming ? 'Confirming...' : 'Confirm'}
              onClick={this.handleConfirmClicked} />
      </section>
    );
  }
});

const RewardPage = React.createClass({
  propTypes: {
    name: React.PropTypes.string.isRequired,
  },
  _getRewardType: function() {
    lbryio.call('reward_type', 'get', this.props.name).then((rewardType) => {
      this.setState({
        rewardType: rewardType,
      });
    });
  },
  getInitialState: function() {
    return {
      rewardType: null,
    };
  },
  componentWillMount: function() {
    this._getRewardType();
  },
  render: function() {
    if (!this.state.rewardType) {
      return null;
    }

    let Reward;
    if (this.props.name == 'link_github') {
      Reward = LinkGithubReward;
    }

    const {title, description, value} = this.state.rewardType;
    return (
      <main>
        <section className="card">
          <h2>{title}</h2>
          <CreditAmount amount={value} />
          <p>{this.state.rewardType.claimed
            ? <span class="empty">This reward has been claimed.</span>
            : description}</p>
          <Reward onClaimed={this._getRewardType} />
        </section>
      </main>
    );
  }
});

export default RewardPage;
