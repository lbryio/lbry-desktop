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
    available: React.PropTypes.bool,
  },
  render: function() {

    var claimInfo = this.props.claimInfo;
    var thumbnail = claimInfo.thumbnail;
    var title = claimInfo.title;
    var description = claimInfo.description;
    var author = claimInfo.author;
    var language = claimInfo.language;
    var license = claimInfo.license;
    var fileContentType = (claimInfo.content_type || claimInfo['content-type']);
    var mediaType = lbry.getMediaType(fileContentType);
    var available = this.props.available;
    var amount = this.props.amount || 0.0;

    return (
      <div className="row-fluid">
        <div className="span4">
          <img src={thumbnail || '/img/default-thumb.svg'} alt={'Photo for ' + title} style={formatItemImgStyle} />
        </div>
        <div className="span8">
          <p>{description}</p>
          <section>
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
          </section>
          <section>
            {mediaType == 'video' ? <WatchLink streamName={this.props.name} button="primary" /> : null}
            <DownloadLink streamName={this.props.name} button="alt" />
          </section>
          <section>
            <Link href="https://lbry.io/dmca" label="report" className="button-text-help" />
          </section>
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
    available: React.PropTypes.bool,
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
      matchFound: null,
    };
  },
  componentWillMount: function() {
    document.title = 'lbry://' + this.props.name;

    lbry.lighthouse.search(this.props.name, (results) => {
      var result = results[0];

      if (result.name != this.props.name) {
        this.setState({
          searching: false,
          matchFound: false,
        });
      } else {
        this.setState({
          amount: result.cost,
          available: result.available,
          claimInfo: result.value,
          searching: false,
          matchFound: true,
        });  
      }
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
          {this.state.matchFound ? (
            <FormatsSection name={name} claimInfo={claimInfo} amount={amount} available={available} />
          ) : (
            <div>
              <h2>No content</h2>
              There is no content available at the name <strong>lbry://{this.props.name}</strong>. If you reached this page from a link within the LBRY interface, please <Link href="/?report" label="report a bug" />. Thanks!
            </div>
          )}
        </section>
      </main>);
  }
});