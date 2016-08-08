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
      <section className="card">
        <h3>Generate New Address</h3>
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
      <section className="card">
        <h3>Send Credits</h3>
        <div className="form-row">
          <label htmlFor="amount">Amount <input id="amount" type="text" size="10" onChange={this.setAmount}></input></label>
        </div>
        <div className="form-row">
          <label htmlFor="address">Recipient address <input id="address" type="text" size="60" onChange={this.setAddress}></input></label>
        </div>
        <div className="form-row">
          <Link button="primary" label="Send" onClick={this.sendToAddress} disabled={!(parseFloat(this.state.amount) > 0.0) || this.state.address == ""} />
        </div>
        {
          this.state.results ?
          <div className="form-row">
            <h4>Results</h4>
            {this.state.results}
          </div>
          : ''
        }
      </section>
    );
  }
});

var WalletPage = React.createClass({
  componentDidMount: function() {
    document.title = "My Wallet";
  },
  /*
  Below should be refactored so that balance is shared all of wallet page. Or even broader?
  What is the proper React pattern for sharing a global state like balance?
   */
  getInitialState: function() {
    return {
      balance: "Checking balance...",
    }
  },
  componentWillMount: function() {
    lbry.getBalance((results) => {
      this.setState({
        balance: results,
      });
    });
  },
  render: function() {
    return (
      <main className="page">
        <section className="card">
          <h3>Balance</h3>
          {this.state.balance} <CurrencySymbol />
        </section>
        <SendToAddressSection />
        <NewAddressSection />
        <section className="card">
          <h3>Claim Invite Code</h3>
          <Link href="?claim" label="Claim a LBRY beta invite code" button="alt" />
        </section>
      </main>
    );
  }
});
