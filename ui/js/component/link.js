import React from 'react';
import {Icon} from './common.js';
import Modal from '../component/modal.js';
import rewards from '../rewards.js';

export let Link = React.createClass({
  propTypes: {
    label: React.PropTypes.string,
    icon: React.PropTypes.string,
    button: React.PropTypes.string,
    badge: React.PropTypes.string,
    hidden: React.PropTypes.bool,
  },
  getDefaultProps: function() {
    return {
      hidden: false,
      disabled: false,
    };
  },
  handleClick: function(e) {
    if (this.props.onClick) {
      this.props.onClick(e);
    }
  },
  render: function() {
    if (this.props.hidden) {
      return null;
    }

    /* The way the class name is generated here is a mess -- refactor */

    const className = (this.props.className || '') +
      (!this.props.className && !this.props.button ? 'button-text' : '') + // Non-button links get the same look as text buttons
      (this.props.button ? ' button-block button-' + this.props.button + ' button-set-item' : '') +
      (this.props.disabled ? ' disabled' : '');

    let content;
    if (this.props.children) { // Custom content
      content = this.props.children;
    } else {
      content = (
        <span {... 'button' in this.props ? {className: 'button__content'} : {}}>
          {'icon' in this.props ? <Icon icon={this.props.icon} fixed={true} /> : null}
          {<span className="link-label">{this.props.label}</span>}
          {'badge' in this.props ? <span className="badge">{this.props.badge}</span> : null}
        </span>
      );
    }

    return (
      <a className={className} href={this.props.href || 'javascript:;'} title={this.props.title}
         onClick={this.handleClick} {... 'style' in this.props ? {style: this.props.style} : {}}>
        {content}
      </a>
    );
  }
});

export let RewardLink = React.createClass({
  propTypes: {
    type: React.PropTypes.string.isRequired,
    claimed: React.PropTypes.bool,
    onRewardClaim: React.PropTypes.func,
    onRewardFailure: React.PropTypes.func
  },
  refreshClaimable: function() {
    switch(this.props.type) {
      case 'new_user':
        this.setState({ claimable: true });
        return;

      case 'first_publish':
        lbry.claim_list_mine().then(function(list) {
          this.setState({
            claimable: list.length > 0
          })
        }.bind(this));
        return;
    }
  },
  componentWillMount: function() {
    this.refreshClaimable();
  },
  getInitialState: function() {
    return {
      claimable: true,
      pending: false,
      errorMessage: null
    }
  },
  claimReward: function() {
    this.setState({
      pending: true
    })
    rewards.claimReward(this.props.type).then((reward) => {
      this.setState({
        pending: false,
        errorMessage: null
      })
      if (this.props.onRewardClaim) {
        this.props.onRewardClaim(reward);
      }
    }).catch((error) => {
      this.setState({
        errorMessage: error.message,
        pending: false
      })
    })
  },
  clearError: function() {
    if (this.props.onRewardFailure) {
      this.props.onRewardFailure()
    }
    this.setState({
      errorMessage: null
    })
  },
  render: function() {
    return (
      <div className="reward-link">
        {this.props.claimed
          ? <span><Icon icon="icon-check" /> Reward claimed.</span>
          : <Link button={this.props.button ? this.props.button : 'alt'} disabled={this.state.pending || !this.state.claimable }
                  label={ this.state.pending ? "Claiming..." : "Claim Reward"} onClick={this.claimReward} />}
        {this.state.errorMessage ?
         <Modal isOpen={true} contentLabel="Reward Claim Error" className="error-modal" onConfirmed={this.clearError}>
           {this.state.errorMessage}
         </Modal>
          : ''}
      </div>
    );
  }
});