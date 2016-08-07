var NewAddressSection = React.createClass({
  generateAddress: function() {
    lbry.getNewAddress((results) => {
      this.setState({
        address: results,
      })
    });
  },
  getInitialState: function() {
    return {
      address: "",
    }
  },
  render: function() {
    return (
      <section>
        <h1>Generate New Address</h1>
        <section><input type="text" size="60" value={this.state.address}></input></section>
        <Link button="primary" label="Generate" onClick={this.generateAddress} />
      </section>
    );
  }
});

var SendToAddressSection = React.createClass({
  sendToAddress: function() {
    if ((this.state.balance - this.state.amount) < 1)
    {
      alert("Insufficient balance: after this transaction you would have less than 1 LBC in your wallet.")
      return;
    }

    this.setState({
      results: "",
    });

    lbry.sendToAddress(this.state.amount, this.state.address, (results) => {
      if(results === true)
      {
        this.setState({
          results: "Your transaction was successfully placed in the queue.",
        });
      }
      else
      {
        this.setState({
          results: "Something went wrong: " + results
        });
      }
    }, (error) => {
      this.setState({
        results: "Something went wrong: " + error.faultString + " " + error.faultCode
      })
    });
  },
  getInitialState: function() {
    return {
      address: "",
      amount: 0.0,
      balance: "Checking balance...",
      results: "",
    }
  },
  componentWillMount: function() {
    lbry.getBalance((results) => {
      this.setState({
        balance: results,
      });
    });
  },
  setAmount: function(event) {
    this.setState({
      amount: parseFloat(event.target.value),
    })
  },
  setAddress: function(event) {
    this.setState({
      address: event.target.value,
    })
  },
  render: function() {
    return (
      <section>
        <h1>Send Credits</h1>
        <section>
          <section><label for="balance">Balance {this.state.balance}</label></section>
          <label for="amount">Amount <input id="amount" type="text" size="10" onChange={this.setAmount}></input></label>
          <label for="address">Recipient address <input id="address" type="text" size="60" onChange={this.setAddress}></input></label>
          <Link button="primary" label="Send" onClick={this.sendToAddress} disabled={!(parseFloat(this.state.amount) > 0.0) || this.state.address == ""} />
        </section>
        <section className={!this.state.results ? 'hidden' : ''}>
          <h4>Results:</h4>
          {this.state.results}
        </section>
      </section>
    );
  }
});

var WalletPage = React.createClass({
  render: function() {
    return (
      <main className="page">
        <NewAddressSection />
        <SendToAddressSection />
        <section>
          <h4>Claim invite code</h4>
          <Link href="?claim" label="Claim a LBRY beta invite code"/>
        </section>
        <section>
          <ReturnLink />
        </section>
      </main>
    );
  }
});
