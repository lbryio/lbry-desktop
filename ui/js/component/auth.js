import React from 'react';
import lbryio from '../lbryio.js';

import Modal from './modal.js';
import ModalPage from './modal-page.js';
import {Link, RewardLink} from '../component/link.js';
import {FormField, FormRow} from '../component/form.js';
import rewards from '../rewards.js';


const SubmitEmailStage = React.createClass({
  getInitialState: function() {
    return {
      rewardType: null,
      email: '',
      submitting: false
    };
  },
  handleEmailChanged: function(event) {
    this.setState({
      email: event.target.value,
    });
  },
  handleSubmit: function(event) {
    event.preventDefault();

    this.setState({
      submitting: true,
    });
    lbryio.call('user_email', 'new', {email: this.state.email}, 'post').then(() => {
      this.props.onEmailSaved();
    }, (error) => {
      if (this._emailRow) {
        this._emailRow.showError(error.message)
      }
      this.setState({ submitting: false });
    });
  },
  render: function() {
    return (
      <section>
        <form onSubmit={this.handleSubmit}>
          <FormRow ref={(ref) => { this._emailRow = ref }} type="text" label="Email" placeholder="admin@toplbryfan.com"
                     name="email" value={this.state.email}
                     onChange={this.handleEmailChanged} />
          <div className="form-row-submit">
            <Link button="primary" label="Next" disabled={this.state.submitting} onClick={this.handleSubmit} />
          </div>
        </form>
      </section>
    );
  }
});

const ConfirmEmailStage = React.createClass({
  getInitialState: function() {
    return {
      rewardType: null,
      code: '',
      submitting: false,
      errorMessage: null,
    };
  },
  handleCodeChanged: function(event) {
    this.setState({
      code: event.target.value,
    });
  },
  handleSubmit: function(event) {
    event.preventDefault();
    this.setState({
      submitting: true,
    });

    const onSubmitError = function(error) {
      if (this._codeRow) {
        this._codeRow.showError(error.message)
      }
      this.setState({ submitting: false });
    }.bind(this)

    lbryio.call('user_email', 'confirm', {verification_token: this.state.code}, 'post').then((userEmail) => {
      if (userEmail.IsVerified) {
        this.props.onEmailConfirmed();
      } else {
        onSubmitError(new Error("Your email is still not verified.")) //shouldn't happen?
      }
    }, onSubmitError);
  },
  render: function() {
    return (
      <section>
        <form onSubmit={this.handleSubmit}>
          <FormRow label="Verification Code" ref={(ref) => { this._codeRow = ref }} type="text"
                     name="code" placeholder="a94bXXXXXXXXXXXXXX" value={this.state.code} onChange={this.handleCodeChanged}
                     helper="A verification code is required to access this version."/>
          <div className="form-row-submit">
            <Link button="primary" label="Verify" disabled={this.state.submitting} onClick={this.handleSubmit} />
          </div>
        </form>
      </section>
    );
  }
});

const WelcomeStage = React.createClass({
  propTypes: {
    endAuth: React.PropTypes.func,
  },
  getInitialState: function() {
    return {
      hasReward: false,
      rewardAmount: null,
    }
  },
  onRewardClaim: function(reward) {
    this.setState({
      hasReward: true,
      rewardAmount: reward
    })
  },
  render: function() {
    return (
      !this.state.hasReward ?
        <Modal type="custom" isOpen={true} contentLabel="Welcome to LBRY" {...this.props}>
          <section>
            <h3 className="modal__header">Welcome to LBRY.</h3>
            <p>Using LBRY is like dating a centaur. Totally normal up top, and <em>way different</em> underneath.</p>
            <p>On the upper level, LBRY is like other popular video and media sites.</p>
            <p>Below, LBRY is like nothing else. Using blockchain and decentralization, LBRY is controlled by its users -- you -- and no one else.</p>
            <p>Thanks for being a part of it! Here's a nickel, kid.</p>
            <div style={{textAlign: "center", marginBottom: "12px"}}>
              <RewardLink type="new_user" button="primary" onRewardClaim={this.onRewardClaim} onRewardFailure={this.props.endAuth} />
            </div>
          </section>
         </Modal> :
         <Modal type="alert" overlayClassName="modal-overlay modal-overlay--clear" isOpen={true} contentLabel="Welcome to LBRY" {...this.props} onConfirmed={this.props.endAuth}>
          <section>
            <h3 className="modal__header">About Your Reward</h3>
            <p>You earned a reward of %award% LBRY credits, or <em>LBC</em>.</p>
            <p>This reward will show in your Wallet momentarily, likely while you are reading this message.</p>
            <p>LBC is used to compensate creators, to publish, and to have say in how the network works.</p>
            <p>No need to understand it all just yet! Try watching or downloading something next.</p>
          </section>
      </Modal>
    );
  }
});


const ErrorStage = React.createClass({
  render: function() {
    return (
      <section>
        <p>An error was encountered that we cannot continue from.</p>
        <p>At least we're earning the name beta.</p>
        <Link button="alt" label="Try Reload" onClick={() => { window.location.reload() } } />
      </section>
    );
  }
});

const PendingStage = React.createClass({
  render: function() {
    return (
      <section>
        <p>Preparing for first access <span className="busy-indicator"></span></p>
      </section>
    );
  }
});

export const AuthOverlay = React.createClass({
  _stages: {
    pending: PendingStage,
    error: ErrorStage,
    email: SubmitEmailStage,
    confirm: ConfirmEmailStage,
    welcome: WelcomeStage
  },
  getInitialState: function() {
    return {
      stage: null,
      stageProps: {}
    };
  },
  endAuth: function() {
    this.setState({
      stage: null
    });
  },
  componentWillMount: function() {
    lbryio.authenticate().then(function(user) {
      if (!user.HasVerifiedEmail) { //oops I fucked this up
        this.setState({
          stage: "email",
          stageProps: {
            onEmailSaved: function() {
              this.setState({
                stage: "confirm",
                stageProps: {
                  onEmailConfirmed: function() { this.setState({ stage: "welcome"}) }.bind(this)
                }
              })
            }.bind(this)
          }
        })
      } else {
        lbryio.call('reward', 'list', {}).then(function(userRewards) {
          userRewards.filter(function(reward) {
            return reward.RewardType == "new_user" && reward.TransactionID;
          }).length ?
             this.endAuth() :
             this.setState({ stage: "welcome" })
        }.bind(this));
      }
    }.bind(this)).catch((err) => {
      this.setState({
        stage: "error",
        stageProps: { errorText: err.message }
      })
      document.dispatchEvent(new CustomEvent('unhandledError', {
        detail: {
          message: err.message,
          data: err.stack
        }
      }));
    })
  },
  render: function() {
    if (!this.state.stage) {
        return null;
    }
    const StageContent = this._stages[this.state.stage];
    return (
      this.state.stage != "welcome" ?
          <ModalPage className="modal-page--full" isOpen={true} contentLabel="Authentication" {...this.props}>
            <h1>LBRY Early Access</h1>
            <StageContent {...this.state.stageProps} />
          </ModalPage> :
          <StageContent endAuth={this.endAuth} {...this.state.stageProps}  />
    );
  }
});