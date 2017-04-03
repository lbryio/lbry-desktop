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
      submitting: false,
      errorMessage: null,
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
      this.props.onDone();
    }, (error) => {
      this.setState({
        submitting: false,
        errorMessage: error.message,
      });
    });
  },
  render: function() {
    return (
      <section>
        <h1>Welcome to LBRY</h1>
        {this.state.errorMessage
          ? <Notice isError>
              {this.state.errorMessage}
            </Notice>
          : null}
        <p>Copy here explaining what we do with your email, and the reward.</p>
        <form onSubmit={this.handleSubmit}>
          <section>Email <label><FormField ref={(field) => { this._emailField = field }} type="text" name="email" value={this.state.email} onChange={this.handleEmailChanged} /></label></section>
          <section><Link button="primary" label="Submit and Continue" disabled={this.state.submitting} onClick={this.handleSubmit} /></section>
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
        console.log('succeeded');
        this.props.onDone();
      }, (err) => {
        console.log('failed');
        this.props.onDone();
      });
    }, (error) => {
      this.setState({
        submitting: false,
        errorMessage: error.message,
      });
    });
  },
  render: function() {
    return (
      <section>
        <h1>Confirm Your Email Address</h1>
        {this.state.errorMessage
          ? <Notice isError>
              {this.state.errorMessage}
            </Notice>
          : null}
        <p>Please enter your verification code to confirm your email address.</p>
        <form onSubmit={this.handleSubmit}>
          <section><label>Verification Code: <FormField ref={(field) => { this._codeField = field }} type="text" name="code" value={this.state.code} onChange={this.handleCodeChanged} /></label></section>
          <section><Link button="primary" label="Verify" disabled={this.state.submitting} onClick={this.handleSubmit} /></section>
        </form>
      </section>
    );
  }
});

const FinalMessageStage = React.createClass({
  render: function() {
    return (
      <section>
        <h1>Email verified</h1>
        <p>Text here about what happens next</p>
        <section><Link button="primary" label="OK" onClick={this.props.onDone} /></section>
      </section>
    );
  }
});

export const Welcome = React.createClass({
  _stages: [
    SubmitEmailStage,
    ConfirmEmailStage,
    FinalMessageStage,
  ],
  propTypes: {
    onDone: React.PropTypes.func.isRequired,
  },
  getInitialState: function() {
    return {
      stageNum: 0,
    };
  },
  handleStageDone: function() {
    if (this.state.stageNum >= this._stages.length - 1) {
      this.props.onDone();
    } else {
      this.setState({
        stageNum: this.state.stageNum + 1,
      });
    }
  },
  render: function() {
    const Content = this._stages[this.state.stageNum];
    return (
      <ModalPage contentLabel="Welcome to LBRY" {...this.props}>
        <Content onDone={this.handleStageDone} />
      </ModalPage>
    );
  }
});

