var formatItemStyle = {
  fontSize: '0.95em',
  marginTop: '10px',
  maxHeight: '220px'
}, formatItemImgStyle = {
  maxWidth: '100%',
  maxHeight: '100%',
  display: 'block',
  marginLeft: 'auto',
  marginRight: 'auto',
  marginTop: '5px',
}, formatHeaderStyle = {
  fontWeight: 'bold',
  marginBottom: '5px'
}, formatSubheaderStyle = {
  marginBottom: '10px',
  fontSize: '0.9em'
}, formatItemDescriptionStyle = {
  color: '#444',
  marginBottom: '5px',
  fontSize: '1.2em',
}, formatItemMetadataStyle = {
  color: '#444',
  marginBottom: '5px',
  fontSize: '0.9em',
}, formatItemCostStyle = {
  float: 'right'
};

var FormatItem = React.createClass({
  propTypes: {
    results: React.PropTypes.object,
  },
  render: function() {
    var results = this.props.results;
    var name = results.name;
    var thumbnail = results.thumbnail;
    var title = results.title;
    var amount = results.cost_est ? results.cost_est : 0.0;
    var description = results.description;
    var author = results.author;
    var language = results.language;
    var license = results.license;
    var fileContentType = results.content_type;

    return (
      <div className="row-fluid" style={formatItemStyle}>
        <div className="span4">
          <img src={thumbnail} alt={'Photo for ' + title} style={formatItemImgStyle} />
        </div>
        <div className="span8">
          <h4 style={formatItemMetadataStyle}><b>Address:</b> {name}</h4>
          <h4 style={formatItemMetadataStyle}><b>Content-Type:</b> {fileContentType}</h4>
          <div style={formatSubheaderStyle}>
            <div style={formatItemCostStyle}><CreditAmount amount={amount} isEstimate={true}/></div>
            <WatchLink streamName={name} />
            &nbsp;&nbsp;&nbsp;
            <DownloadLink streamName={name} />
          </div>
          <p style={formatItemDescriptionStyle}>{description}</p>
          <div>
            <span style={formatItemMetadataStyle}><b>Author:</b> {author}</span><br />
            <span style={formatItemMetadataStyle}><b>Language:</b> {language}</span><br />
            <span style={formatItemMetadataStyle}><b>License:</b> {license}</span><br />
          </div>
        </div>
      </div>
      );
  }
});

var FormatsSection = React.createClass({
  propTypes: {
    results: React.PropTypes.object,
    name: React.PropTypes.string,
  },
  render: function() {
    var name = this.props.name;
    var format = this.props.results;
    var title = format.title;

    if(format == null)
    {
      return (
        <div>
          <h1 style={formatHeaderStyle}>Sorry, no results found for "{name}".</h1>
        </div>);
    }

    return (
      <div>
        <h1 style={formatHeaderStyle}>{title}</h1>
      {/* In future, anticipate multiple formats, just a guess at what it could look like
      // var formats = this.props.results.formats
      // return (<tbody>{formats.map(function(format,i){ */}
          <FormatItem results={format}/>
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
      results: null,
      searching: true,
    };
  },
  componentWillMount: function() {
    lbry.search(this.props.name, (results) => {
      this.setState({
        results: results[0],
        searching: false,
      });
    });
  },
  render: function() {
    if (this.state.results == null && this.state.searching) {
      // Still waiting for metadata
      return null;
    }

    var name = this.props.name;
    var metadata = this.state.metadata;
    var results = this.state.results;

    return (
      <main className="page">
        <SubPageLogo />
        <FormatsSection name={name} results={results}/>
        <section>
          <Link href="/" label="<< Return" />
        </section>
      </main>);
  }
});