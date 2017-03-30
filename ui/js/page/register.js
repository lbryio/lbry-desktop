import React from 'react';
import lbryio from '../lbryio.js';
import {getLocal, setLocal} from '../utils.js';
import FormField from '../component/form.js'
import {Link} from '../component/link.js'

const RegisterPage = React.createClass({
  _getRewardType: function() {
    lbryio.call('reward_type', 'get', this.props.name).then((rewardType) => {
      this.setState({
        rewardType: rewardType,
      });
    });
  },
  handleSubmit: function(event) {
    if (event !== 'undefined') {
      event.preventDefault();
    }

    if (!this.state.email) {
      this._emailField.warnRequired();
    }
  },
  getInitialState: function() {
    return {
      rewardType: null,
      email: null,
    };
  },
  componentWillMount: function() {
    this._getRewardType();
  },
  render: function() {
    return (
      <main>
        <section className="card">
          <h1>Register a LBRY account</h1>
          <form onSubmit={this.handleSubmit}>
            <section><label>Email <FormField ref={(field) => { this._emailField = field }} type="text" name="email" value={this.state.email} /></label></section>
            <div><Link button="primary" label="Submit" onClick={this.handleSubmit} /></div>
          </form>
        </section>
      </main>
    );
  }
});

export default RegisterPage;
