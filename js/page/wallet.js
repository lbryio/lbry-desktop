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
        <h1>Create New Address:</h1>
        <button type="button" onClick={this.generateAddress}>Generate New Address</button> <input type="text" size="60" value={this.state.address}></input>
      </div>
    );
  }
});

var SendToAddressSection = React.createClass({
  sendToAddress: function() {
    this.setState({
      results: "",
    });

    lbry.sendToAddress((results) => {
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
      amount: event.target.value,
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
        <h1>Send To Address:</h1>
        <label for="balance">Balance: {this.state.balance}</label><br />
        <label for="amount">Amount:</label> <input id="amount" type="number" size="10" onChange={this.setAmount}></input><br />
        <label for="address">Address:</label> <input id="address" type="text" size="60" onChange={this.setAddress}></input><br />
        <button type="button" onClick={this.sendToAddress}>Send Amount to Address</button><br /><br />
        <h4>Results:</h4>
        <span>{this.state.results}</span>
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
