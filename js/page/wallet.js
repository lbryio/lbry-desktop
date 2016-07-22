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
      <div>
        <h1>Generate New Address:</h1>
        <input type="text" size="60" value={this.state.address}></input><br /><br />
        <Link button="primary" label="Generate" onClick={this.generateAddress} />
      </div>
    );
  }
});

var SendToAddressSection = React.createClass({
  sendToAddress: function() {
    this.setState({
      results: "",
    });

    lbry.sendToAddress(this.state.amount, this.state.address, (results) => {
      if(results === true)
      {
        this.setState({
          results: "Your transaction was completed successfully.",
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
      <div>
        <h1>Send Amount To Address:</h1>
        <label for="balance">Balance: {this.state.balance}</label><br /><br />
        <label for="amount">Amount:</label> <input id="amount" type="text" size="10" onChange={this.setAmount}></input><br /><br />
        <label for="address">Address:</label> <input id="address" type="text" size="60" onChange={this.setAddress}></input><br /><br />
        <Link button="primary" label="Send" onClick={this.sendToAddress} disabled={!(parseFloat(this.state.amount) > 0.0) || this.state.address == ""} /><br /><br />
        <h4>Results:</h4>
        <span>{this.state.results}</span><br />
      </div>
    );
  }
});

var WalletPage = React.createClass({
  render: function() {
    return (
      <main className="page">
        <SubPageLogo />
        <NewAddressSection /><br />
        <SendToAddressSection /><br />
        <section>
          <Link href="/" label="<< Return" />
        </section>
      </main>
    );
  }
});
