var publishBidAmountInputStyle = {
  width: '50px',
};

var PublishPage = React.createClass({
  publish: function() {
    lbry.publish({
      name: this.state.name,
      file_path: this.state.filePath,
      bid: parseFloat(this.state.bid),
    });
  },
  getInitialState: function() {
    return {
      name: '',
      nameResolved: false,
      bid: '',
      claimValue: 0,
    };
  },
  handleNameChange: function(event) {
    var name = event.target.value;

    if (!name) {
      this.setState({
        name: '',
        nameResolved: false,
      })

      return;
    }

    lbry.resolveName(name, (info) => {
      if (!info) {
        this.setState({
          name: name,
          nameResolved: false
        });
      } else {
        lbry.search(name, (results) => {
          var claimValue = results[0].value;

          this.setState({
            name: name,
            nameResolved: true,
            claimValue: parseFloat(claimValue),
          });
        });
      }
    });
  },
  handleFileChange: function(event) {
    var filePath = event.target.value;
    this.setState({
      filePath: (filePath[0] == '/' ? filePath : ('~/Desktop/' + filePath))
    });
  },
  handleBidChange: function(event) {
    this.setState({
      bid: event.target.value
    });
  },
  readyToPublish: function() {
    var bidFloat = parseFloat(this.state.bid.value);
    return (this.state.name && this.state.filePath && !isNaN(bidFloat) && bidFloat > this.state.claimValue);
  },
  render: function() {
    return (
      <main className="page">
        <SubPageLogo />
        <h1>Publish Content</h1>
        <section>
          <h4>LBRY name</h4>
          <div className="help">What LBRY name would you like to claim for this file?</div>
          lbry://<input type="text" ref="name" onChange={this.handleNameChange} />
          {
            (!this.state.name ? '' :
              (this.state.nameResolved ? <em> This name is currently claimed for <strong>{lbry.formatCredits(this.state.claimValue)}</strong> credits</em>
                                       : <em> This name is available</em>))
          }
        </section>

        <section>
          <h4>Choose file</h4>
          <div className="help">Please enter the path of the file you would like to publish on LBRY. (You may also put the file on your desktop and enter just the file name.)</div>
          <input type="text" name="path" onChange={this.handleFileChange} />
        </section>

        <section>
          <h4>Bid amount</h4>
          <div className="help">How much would you like to bid for this name?
          { !this.state.nameResolved ? <span> Since this name is not currently resolved, you may bid as low as you want, but higher bids help prevent others from claiming your name.</span>
                                     : <span> You must bid over <strong>{lbry.formatCredits(this.state.claimValue)}</strong> credits to claim this name.</span> }
          </div>
          Credits: <input style={publishBidAmountInputStyle} type="text" onChange={this.handleBidChange} value={!this.state.name ? '' : this.state.bid} />
        </section>

        { /* Many more options here ... */ }

        <section>
        <Link button="primary" label="Publish" onClick={this.publish} disabled={!this.readyToPublish()} />
        </section>
        <section>
          <Link href="/" label="<< Return"/>
        </section>
       </main>
    );
  }
});