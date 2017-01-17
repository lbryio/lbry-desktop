import React from 'react';
import lbry from '../lbry.js';
import {Link} from '../component/link.js';
import Modal from '../component/modal.js';

var referralCodeContentStyle = {
  display: 'inline-block',
  textAlign: 'left',
  width: '600px',
}, referralCodeLabelStyle = {
  display: 'inline-block',
  cursor: 'default',
  width: '130px',
  textAlign: 'right',
  marginRight: '6px',
};

var ReferralPage = React.createClass({
  getInitialState: function() {
    return {
      submitting: false,
      modal: null,
      referralCredits: null,
      failureReason: null,
    }
  },
  handleSubmit: function(event) {
    if (typeof event !== 'undefined') {
      event.preventDefault();
    }

    if (!this.refs.code.value) {
      this.setState({
        modal: 'missingCode',
      });
    } else if (!this.refs.email.value) {
      this.setState({
        modal: 'missingEmail',
      });
    }

    this.setState({
      submitting: true,
    });

    lbry.getNewAddress((address) => {
      var code = this.refs.code.value;
      var email = this.refs.email.value;

      var xhr = new XMLHttpRequest;
      xhr.addEventListener('load', () => {
        var response = JSON.parse(xhr.responseText);

        if (response.success) {
          this.setState({
            modal: 'referralInfo',
            referralCredits: response.referralCredits,
          });
        } else {
          this.setState({
            submitting: false,
            modal: 'lookupFailed',
            failureReason: response.reason,
          });
        }
      });

      xhr.addEventListener('error', () => {
        this.setState({
          submitting: false,
          modal: 'couldNotConnect',
        });
      });

      xhr.open('POST', 'https://invites.lbry.io/check', true);
      xhr.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');
      xhr.send('code=' + encodeURIComponent(code) + '&address=' + encodeURIComponent(address) +
               '&email=' + encodeURIComponent(email));
    });
  },
  closeModal: function() {
    this.setState({
      modal: null,
    });
  },
  handleFinished: function() {
    localStorage.setItem('claimCodeDone', true);
    window.location = '?home';
  },
  render: function() {
    return (
      <main>
        <form onSubmit={this.handleSubmit}>
          <div className="card">
            <h2>Check your referral credits</h2>
            <section style={referralCodeContentStyle}>
              <p>Have you referred others to LBRY? Enter your referral code and email address below to check how many credits you've earned!</p>
              <p>As a reminder, your referral code is the same as your LBRY invitation code.</p>
            </section>
            <section>
              <section><label style={referralCodeLabelStyle} htmlFor="code">Referral code</label><input name="code" ref="code" /></section>
              <section><label style={referralCodeLabelStyle} htmlFor="email">Email</label><input name="email" ref="email" /></section>
            </section>
            <section>
              <Link button="primary" label={this.state.submitting ? "Submitting..." : "Submit"}
                    disabled={this.state.submitting} onClick={this.handleSubmit} />
              <input type='submit' className='hidden' />
            </section>
          </div>
        </form>
        <Modal isOpen={this.state.modal == 'referralInfo'} contentLabel="Credit earnings"
               onConfirmed={this.handleFinished}>
          {this.state.referralCredits > 0
            ? `You have earned ${response.referralCredits} credits from referrals. We will credit your account shortly. Thanks!`
            : 'You have not earned any new referral credits since the last time you checked. Please check back in a week or two.'}
        </Modal>
        <Modal isOpen={this.state.modal == 'lookupFailed'} contentLabel={failureReason}
               onConfirmed={this.closeModal}>
          {this.state.failureReason}
        </Modal>
        <Modal isOpen={this.state.modal == 'couldNotConnect'} contentLabel="Couldn't confirm referral code"
               onConfirmed={this.closeModal}>
          LBRY couldn't connect to our servers to confirm your referral code. Please check your internet connection.
        </Modal>
      </main>
    );
  }
});

export default ReferralPage;
