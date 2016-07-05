var claimCodePageStyle = {
  textAlign: 'center',
}, claimCodeContentStyle = {
  display: 'inline-block',
  textAlign: 'left',
  width: '600px',
}, claimCodeLabelStyle = {
  display: 'inline-block',
  cursor: 'default',
  width: '130px',
};

var ClaimCodePage = React.createClass({
  getInitialState: function() {
    return {
      submitting: false,
    }
  },
  handleSubmit: function() {
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
          alert('Your invite code has been redeemed! 200 LBRY credits will be added to your balance shortly.');
          // Send them to "landing" instead of "home" (home will just trigger the message all over again until the credits arrive)
          window.location = '?landing';
        } else {
          alert("You've entered an invalid code, or one that's already been claimed. Please check your code and try again.");
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
      xhr.send('code=' + code + '&address=' + address + '&email=' + email);
    });
  },
  handleSkip: function() {
    alert('Welcome to LBRY! You can visit the Settings page to redeem an invite code at any time.');
    window.location = '?landing';
  },
  render: function() {
    return (
      <main className="page" style={claimCodePageStyle}>
      <h1>Claim your beta invitation code</h1>
      <section style={claimCodeContentStyle}>
        <p>Thanks for beta testing LBRY! Enter your invitation code and email address below to receive your 200 free
           LBRY credits.</p>
        <p>You will be added to our mailing list (if you're not already on it) and will be eligible for future rewards for beta testers.</p>
      </section>
      <section>
        <form>
          <section><label style={claimCodeLabelStyle} htmlFor="code">Invitation code</label><input name="code" ref="code" /></section>
          <section><label style={claimCodeLabelStyle} htmlFor="email">Email</label><input name="email" ref="email" /></section>
        </form>
      </section>
      <section>
        <Link button="primary" label={this.state.submitting ? "Submitting..." : "Submit"}
              disabled={this.state.submitting} onClick={this.handleSubmit} />
        <Link button="alt" label="Skip" disabled={this.state.submitting} onClick={this.handleSkip} />
      </section>
      </main>
    );
  }
});
