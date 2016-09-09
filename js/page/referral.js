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
    }
  },
  handleSubmit: function() {
    if (!this.refs.code.value) {
      alert('Please enter a referral code.');
      return;
    } else if (!this.refs.email.value) {
      alert('Please enter an email address.');
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
          alert('You have earned ' + response.referralCredits + ' credits from referrals and ' +
                response.activationCredits + ' credits from activations.');

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
        alert('LBRY couldn\'t connect to our servers to confirm your referral code. Please check your ' +
              'internet connection.');
      });

      xhr.open('POST', 'https://invites.lbry.io/check', true);
      xhr.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');
      xhr.send('code=' + encodeURIComponent(code) + '&address=' + encodeURIComponent(address) +
               '&email=' + encodeURIComponent(email));
    });
  },
  render: function() {
    return (
      <main>
        <div className="card">
          <h2>Check your referral credits</h2>
          <section style={referralCodeContentStyle}>
            <p>Have you referred others to LBRY? Enter your referral code and email address below to check how many credits you've earned!</p>
            <p>As a reminder, your referral code is the same as your LBRY invitation code.</p>
          </section>
          <section>
            <form onSubmit={this.handleSubmit}>
              <section><label style={referralCodeLabelStyle} htmlFor="code">Referral code</label><input name="code" ref="code" /></section>
              <section><label style={referralCodeLabelStyle} htmlFor="email">Email</label><input name="email" ref="email" /></section>
            </form>
          </section>
          <section>
            <Link button="primary" label={this.state.submitting ? "Submitting..." : "Submit"}
                  disabled={this.state.submitting} onClick={this.handleSubmit} />
          </section>
        </div>
      </main>
    );
  }
});
