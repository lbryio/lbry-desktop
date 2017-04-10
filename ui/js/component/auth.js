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
          <FormRow ref={(ref) => { this._emailRow = ref }} type="text" label="Email" placeholder="webmaster@toplbryfan.com"
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
  onRewardClaim: function() {
    console.log('omg');
  },
  render: function() {
    return (
      <section>
        <h3 className="modal__header">Welcome to LBRY.</h3>
        <p>LBRY is the first community controlled content marketplace.</p>
        <p>Since you're new here, we'll toss you some credits.</p>
        <div style={{textAlign: "center", marginBottom: "12px"}}>
          <RewardLink type="new_user" onRewardClaim={this.onRewardClaim} />
        </div>
        <p>LBC is blah blah blah.</p>
        <p>And remember, LBRY is a beta and be safe!</p>
      </section>
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
    welcome: WelcomeStage,
  },

  getInitialState: function() {
    return {
      stage: "pending",
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
        this.endAuth()
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
    if (!this.state.stage || lbryio.user && lbryio.user.HasVerifiedEmail) {
      return null;
    }
    const StageContent = this._stages[this.state.stage];
    return (
      this.state.stage != "welcome" ?
          <ModalPage className="modal-page--full"isOpen={true} contentLabel="Authentication" {...this.props}>
            <h1>LBRY Early Access</h1>
            <StageContent {...this.state.stageProps} />
          </ModalPage> :
          <Modal isOpen={true} contentLabel="Welcome to LBRY" {...this.props} onConfirmed={this.endAuth}>
            <StageContent {...this.state.stageProps} />
          </Modal>
    );
  }
});