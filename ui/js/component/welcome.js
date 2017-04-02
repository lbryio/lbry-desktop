import React from 'react';
import lbryio from '../lbryio.js';

import ModalPage from './modal-page.js';
import {Link} from '../component/link.js';
import FormField from '../component/form.js';
import Notice from '../component/notice.js'

const IntroStage = React.createClass({
  componentWillMount: function() {
    this.props.onCompleted(); // Nothing required to move on
  },
  render: function() {
    return (
      <section>
        <h1>Welcome to LBRY</h1>
        <p>Content will go here...</p>
      </section>
    );
  }
});

const SubmitEmailStage = React.createClass({
  getInitialState: function() {
    return {
      rewardType: null,
      email: '',
      submitting: false,
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
      this.setState({
        submitting: false,
        message: "Your email has been verified.",
        success: true,
      });
      this.props.onCompleted();
    }, (error) => {
      this.setState({
        submitting: false,
        message: error.message,
        success: false,
      });
    });
  },
  render: function() {
    return (
      <section>
        <h1>Verify Your Email Address</h1>
        {this.state.message
          ? <Notice isError={!this.state.success}>
              {this.state.message}
            </Notice>
          : null}
        <p>Copy here explaining what we do with your email, and the reward.</p>
        <form onSubmit={this.handleSubmit}>
          <section><label>Email <FormField ref={(field) => { this._emailField = field }} type="text" name="email" value={this.state.email} onChange={this.handleEmailChanged} /></label></section>
          <div><Link button="primary" label="Submit email" disabled={this.state.submitting} onClick={this.handleSubmit} /></div>
        </form>
      </section>
    );
  }
});

/* const ConfirmEmailStage = React.createClass({
  getInitialState: function() {
    return {
      rewardType: null,
      email: '',
      submitting: false,
    };
  },
  handleEmailChanged: function(event) {
    this.setState({
      email: event.target.value,
    });
  },
  handleSubmit: function(event) {
    event.preventDefault();
    // ...
  },
  render: function() {
    return (
      <section>
        <h1>Confirm Your Email Address</h1>
        {this.state.message
          ? <Notice isError={!this.state.success}>
              {this.state.message}
            </Notice>
          : null}
        <p>Ask the user to take steps needed to confirm (click link in confirmation email, etc.)</p>
        <form onSubmit={this.handleSubmit}>
          <section><label>Email <FormField ref={(field) => { this._emailField = field }} type="text" name="email" value={this.state.email} onChange={this.handleEmailChanged} /></label></section>
          <div><Link button="primary" label="Confirm" disabled={this.state.submitting} onClick={this.handleSubmit} /></div>
        </form>
      </section>
    );
  }
}); */

const FinalMessageStage = React.createClass({
  componentWillMount: function() {
    this.props.onCompleted();
  },
  render: function() {
    return (
      <section>
        <h1>Email verified</h1>
        <p>Text here about what happens next</p>
      </section>
    );
  }
});

export const Welcome = React.createClass({
  _stages: [
    IntroStage,
    SubmitEmailStage,
    //ConfirmEmailStage,
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
  handleNextClicked: function() {
    if (this.state.stageNum >= this._stages.length - 1) {
      this.props.onDone();
    }

    this.setState({
      stageNum: this.state.stageNum + 1,
      stageCompleted: false,
    });
  },
  handleDoneClicked: function() {
    this.props.onDone();
  },
  handleStageComplete: function() {
    console.log('inside handleStageComplete')
    this.setState({
      stageCompleted: true,
    });
  },
  render: function() {
    const Content = this._stages[this.state.stageNum];
    const isLastStage = this.state.stageNum >= this._stages.length - 1;
    return (
      <ModalPage contentLabel="Welcome to LBRY" {...this.props}>
        <Content onCompleted={this.handleStageComplete} />
        <section>
          {!isLastStage
            ? <Link button="primary" label="Next" onClick={this.handleNextClicked} disabled={!this.state.stageCompleted} />
            : <Link button="primary" label="OK" onClick={this.handleOKClicked} />}
        </section>
      </ModalPage>
    );
  }
});

