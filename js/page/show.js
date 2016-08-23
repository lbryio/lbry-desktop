var formatItemImgStyle = {
  maxWidth: '100%',
  maxHeight: '100%',
  display: 'block',
  marginLeft: 'auto',
  marginRight: 'auto',
  marginTop: '5px',
};

var FormatItem = React.createClass({
  propTypes: {
    claimInfo: React.PropTypes.object,
    amount: React.PropTypes.number,
    name: React.PropTypes.string,
    available: React.PropTypes.string,
  },
  render: function() {

    var claimInfo = this.props.claimInfo;
    var thumbnail = claimInfo.thumbnail;
    var title = claimInfo.title;
    var description = claimInfo.description;
    var author = claimInfo.author;
    var language = claimInfo.language;
    var license = claimInfo.license;
    var fileContentType = claimInfo['content-type'];

    var available = this.props.available;
    var amount = this.props.amount || 0.0;

    return (
      <div className="row-fluid">
        <div className="span4">
          <img src={thumbnail} alt={'Photo for ' + title} style={formatItemImgStyle} />
        </div>
        <div className="span8">
          <p>{description}</p>
          <table className="table-standard">
            <tbody>
              <tr>
                <td>Content-Type</td><td>{fileContentType}</td>
              </tr>
              <tr>
                <td>Cost</td><td><CreditAmount amount={amount} isEstimate={!available}/></td>
              </tr>
              <tr>
                <td>Author</td><td>{author}</td>
              </tr>
              <tr>
                <td>Language</td><td>{language}</td>
              </tr>
              <tr>
                <td>License</td><td>{license}</td>
              </tr>
            </tbody>
          </table>
          <WatchLink streamName={this.props.name} button="primary" />
          <DownloadLink streamName={this.props.name} button="alt" />
        </div>
      </div>
      );
  }
});

var FormatsSection = React.createClass({
  propTypes: {
    claimInfo: React.PropTypes.object,
    amount: React.PropTypes.number,
    name: React.PropTypes.string,
    available: React.PropTypes.string,
  },
  render: function() {
    var name = this.props.name;
    var format = this.props.claimInfo;
    var title = format.title;

    if(format == null)
    {
      return (
        <div>
          <h2>Sorry, no results found for "{name}".</h2>
        </div>);
    }

    return (
      <div>
        <div className="meta">lbry://{name}</div>
        <h2>{title}</h2>
      {/* In future, anticipate multiple formats, just a guess at what it could look like
      // var formats = this.props.claimInfo.formats
      // return (<tbody>{formats.map(function(format,i){ */}
          <FormatItem claimInfo={format} amount={this.props.amount} name={this.props.name} available={this.props.available} />
      {/*  })}</tbody>); */}
      </div>);
  }
});

var DetailPage = React.createClass({
  propTypes: {
    name: React.PropTypes.string,
  },
  getInitialState: function() {
    return {
      claimInfo: null,
      amount: null,
      searching: true,
    };
  },
  componentWillMount: function() {
    document.title = 'lbry://' + this.props.name;

    lbry.search(this.props.name, (results) => {
      var result = results[0];
      this.setState({
        amount: result.cost,
        available: result.available,
        claimInfo: result.value,
        searching: false,
      });
    });
  },
  render: function() {
    if (this.state.claimInfo == null && this.state.searching) {
      // Still waiting for metadata
      return null;
    }

    var name = this.props.name;
    var available = this.state.available;
    var claimInfo = this.state.claimInfo;
    var amount = this.state.amount;

    return (
      <main>
        <section className="card">
          <FormatsSection name={name} claimInfo={claimInfo} amount={amount} available={available} />
        </section>
      </main>);
  }
});