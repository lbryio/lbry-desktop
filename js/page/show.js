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
    metadata: React.PropTypes.object,
    name: React.PropTypes.string,
    amount: React.PropTypes.double,
  },
  render: function() {
    return (
      <div className="row-fluid" style={formatItemStyle}>
        <div className="span4">
          <img src={this.props.metadata.thumbnail} alt={'Photo for ' + this.props.metadata.title} style={formatItemImgStyle} />
        </div>
        <div className="span8">
          <h4 style={formatItemMetadataStyle}><b>Address:</b> {this.props.name}</h4>
          <div style={formatSubheaderStyle}>
            <div style={formatItemCostStyle}><CreditAmount amount={this.props.amount} isEstimate={true}/></div>
            <WatchLink streamName={this.props.name} />
            &nbsp;&nbsp;&nbsp;
            <DownloadLink streamName={this.props.name} />
          </div>
          <p style={formatItemDescriptionStyle}>{this.props.metadata.description}</p>
          <div>
            <span style={formatItemMetadataStyle}><b>Author:</b> {this.props.metadata.author}</span><br />
            <span style={formatItemMetadataStyle}><b>Language:</b> {this.props.metadata.language}</span><br />
            <span style={formatItemMetadataStyle}><b>License:</b> {this.props.metadata.license}</span><br />
          </div>
        </div>
      </div>
      );
  }
});

var FormatsSection = React.createClass({
  propTypes: {
    name: React.PropTypes.string,
  },
  getInitialState: function() {
    return {
      metadata: null,
      amount: 0.0,
    };
  },
  componentWillMount: function() {
    lbry.resolveName(this.props.name, (metadata) => {
      this.setState({
        metadata: metadata,
      })
    });
    lbry.search(this.props.name, (results) => {
      this.setState({
        amount: (results ? results[0].cost_est : 0.0)
      });
    });
  },
  render: function() {
    if (this.state.metadata == null) {
      // Still waiting for metadata
      return null;
    }

    var format = this.state.metadata;

    return (
      <div>
        <h1 style={formatHeaderStyle}>{this.state.metadata.title}</h1>
      {/* In future, anticipate multiple formats, just a guess at what it could look like
      // var formats = metadata.formats
      // return (<tbody>{formats.map(function(format,i){ */}
          <FormatItem metadata={format} amount={this.state.amount} name={this.props.name}/>
      {/*  })}</tbody>); */}
      </div>);
  }
});

var DetailPage = React.createClass({
  propTypes: {
    name: React.PropTypes.string,
  },
  render: function() {
    return (
      <main className="page">
        <SubPageLogo />
        <FormatsSection name={this.props.name}/>
        <section>
          <Link href="/" label="<< Return" />
        </section>
      </main>);
  }
});