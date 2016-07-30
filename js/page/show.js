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
    claimInfo: React.PropTypes.object,
    amount: React.PropTypes.number,
    name: React.PropTypes.string,
  },
  render: function() {
    var name = this.props.name;

    var claimInfo = this.props.claimInfo;
    var thumbnail = claimInfo.thumbnail;
    var title = claimInfo.title;
    var description = claimInfo.description;
    var author = claimInfo.author;
    var language = claimInfo.language;
    var license = claimInfo.license;
    var fileContentType = claimInfo['content-type'];

    var amount = this.props.amount || 0.0;

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
    claimInfo: React.PropTypes.object,
    amount: React.PropTypes.number,
    name: React.PropTypes.string,
  },
  render: function() {
    var name = this.props.name;
    var format = this.props.claimInfo;
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
      // var formats = this.props.claimInfo.formats
      // return (<tbody>{formats.map(function(format,i){ */}
          <FormatItem name={name} claimInfo={format} amount={this.props.amount} />
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
    lbry.getClaimInfo(this.props.name, (claimInfo) => {
      this.setState({
        claimInfo: claimInfo.value,
        searching: false,
      });
    });

    lbry.getCostEstimate(this.props.name, (amount) => {
      this.setState({
        amount: amount,
      });
    });
  },
  render: function() {
    if (this.state.claimInfo == null && this.state.searching) {
      // Still waiting for metadata
      return null;
    }

    var name = this.props.name;
    var claimInfo = this.state.claimInfo;
    var amount = this.state.amount;

    return (
      <main className="page">
        <SubPageLogo />
        <FormatsSection name={name} claimInfo={claimInfo} amount={amount} />
        <section>
          <Link href="/" label="<< Return" />
        </section>
      </main>);
  }
});