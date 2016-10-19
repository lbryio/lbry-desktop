var claimCodeContentStyle = {
  display: 'inline-block',
  textAlign: 'left',
  width: '600px',
}, claimCodeLabelStyle = {
  display: 'inline-block',
  cursor: 'default',
  width: '130px',
  textAlign: 'right',
  marginRight: '6px',
};

var ClaimCodePage = React.createClass({
  getInitialState: function() {
    return {
      submitting: false,
    }
  },
  handleSubmit: function(event) {
    if (typeof event !== 'undefined') {
      event.preventDefault();
    }

    if (!this.refs.code.value) {
      alert('Please enter an invitation code or choose "Skip."');
      return;
    } else if (!this.refs.email.value) {
      alert('Please enter an email address or choose "Skip."');
      return;
    }

    this.setState({
      submitting: true
    });

    lbry.getNewAddress((address) => {
      var code = this.refs.code.value;
      var email = this.refs.email.value;

      var xhr = new XMLHttpRequest;
      xhr.addEventListener('load', () => {
        var response = JSON.parse(xhr.responseText);

        if (response.success) {
          var redeemMessage = 'Your invite code has been redeemed. ';
          if (response.referralCredits > 0) {
            redeemMessage += 'You have also earned ' + response.referralCredits + ' credits from referrals. A total of ' +
              (response.activationCredits + response.referralCredits) + ' will be added to your balance shortly.';
          } else if(response.activationCredits > 0) {
            redeemMessage += response.activationCredits + ' credits will be added to your balance shortly.';
          } else {
            redeemMessage += 'The credits will be added to your balance shortly.';
          }
          alert(redeemMessage);
          localStorage.setItem('claimCodeDone', true);
          window.location = '?home';
        } else {
          alert(response.reason);
          this.setState({
            submitting: false
          });
        }
      });

      xhr.addEventListener('error', () => {
        this.setState({
          submitting: false
        });
        alert('LBRY couldn\'t connect to our servers to confirm your invitation code. Please check your ' +
              'internet connection. If you continue to have problems, you can still browse LBRY and ' +
              'visit the Settings page to redeem your code later.');
      });

      xhr.open('POST', 'https://invites.lbry.io', true);
      xhr.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');
      xhr.send('code=' + encodeURIComponent(code) + '&address=' + encodeURIComponent(address) +
               '&email=' + encodeURIComponent(email));
    });
  },
  handleSkip: function() {
    alert('Welcome to LBRY! You can visit the Wallet page to redeem an invite code at any time.');
    localStorage.setItem('claimCodeDone', true);
    window.location = '?home';
  },
  render: function() {
    return (
      <main>
        <form onSubmit={this.handleSubmit}>
          <div className="card">
            <h2>Claim your beta invitation code</h2>
            <section style={claimCodeContentStyle}>
              <p>Thanks for beta testing LBRY! Enter your invitation code and email address below to receive your initial
                 LBRY credits.</p>
              <p>You will be added to our mailing list (if you're not already on it) and will be eligible for future rewards for beta testers.</p>
            </section>
            <section>
              <section><label style={claimCodeLabelStyle} htmlFor="code">Invitation code</label><input name="code" ref="code" /></section>
              <section><label style={claimCodeLabelStyle} htmlFor="email">Email</label><input name="email" ref="email" /></section>
            </section>
            <section>
              <Link button="primary" label={this.state.submitting ? "Submitting..." : "Submit"}
                    disabled={this.state.submitting} onClick={this.handleSubmit} />
              <Link button="alt" label="Skip" disabled={this.state.submitting} onClick={this.handleSkip} />
              <input type='submit' className='hidden' />
            </section>
          </div>
        </form>
      </main>
    );
  }
});
