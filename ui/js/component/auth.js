import React from 'react';
import lbryio from '../lbryio.js';

import ModalPage from './modal-page.js';
import {Link} from '../component/link.js';
import FormField from '../component/form.js';
import Notice from '../component/notice.js'


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
      if (this._emailField) {
        this._emailField.showError(error.message)
      }
      this.setState({ submitting: false });
    });
  },
  render: function() {
    return (
      <section>
        <form onSubmit={this.handleSubmit}>
          <FormField row={true} ref={(field) => { this._emailField = field }} type="text" label="Email" placeholder="webmaster@toplbryfan.com"
                     name="email" value={this.state.email}
                     onChange={this.handleEmailChanged} />
          <div className="form-row">
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

    lbryio.call('user_email', 'confirm', {verification_token: this.state.code}, 'post').then(() => {
      rewards.claimReward('confirm_email').then(() => {
        this.props.onDone();
      }, (err) => {l
        this.props.onDone();
      });
    }, (error) => {
      if (this._codeField) {
        this._codeField.showError(error.message)
        this.setState({ submitting: false })
      }
    });
  },
  render: function() {
    return (
      <section>
        <form onSubmit={this.handleSubmit}>
          <FormField row={true} label="Verification Code" ref={(field) => { this._codeField = field }} type="text"
                     name="code" placeholder="a94bXXXXXXXXXXXXXX" value={this.state.code} onChange={this.handleCodeChanged}
                     helper="A verification code is required to access this version."/>
          <div className="form-row">
            <Link button="primary" label="Verify" disabled={this.state.submitting} onClick={this.handleSubmit} />
          </div>
        </form>
      </section>
    );
  }
});

const ErrorStage = React.createClass({
  render: function() {
    //        <section><Link button="primary" label="OK" onClick={this.props.onDone} /></section>
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
  },
  propTypes: {
    // onDone: React.PropTypes.func.isRequired,
  },
  getInitialState: function() {
    return {
      stage: "pending",
      stageProps: {}
    };
  },
  componentWillMount: function() {
    lbryio.authenticate().then(function(user) {
      console.log(user);
      if (!user.HasVerifiedEmail) {
        this.setState({
          stage: "email",
          stageProps: {
            onEmailSaved: function() {
              this.setState({
                stage: "confirm"
              })
            }.bind(this)
          }
        })
      } else {
        this.setState({ stage: null })
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
  // handleStageDone: function() {
  //   if (this.state.stageNum >= this._stages.length - 1) {
  //     this.props.onDone();
  //   } else {
  //     this.setState({
  //       stageNum: this.state.stageNum + 1,
  //     });
  //   }
  // },

  //        <Content onDone={this.handleStageDone} />
  render: function() {
    console.log(lbryio.user);
    if (!this.state.stage || lbryio.user && lbryio.user.HasVerifiedEmail) {
      return null;
    }
    const StageContent = this._stages[this.state.stage];
    return (
      <ModalPage isOpen={true} contentLabel="Authentication" {...this.props}>
        <h1>LBRY Early Access</h1>
        <StageContent {...this.state.stageProps} />
      </ModalPage>
    );
  }
});