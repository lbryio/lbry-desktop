var fetchResultsStyle = {
    color: '#888',
    textAlign: 'center',
    fontSize: '1.2em'
  };

var SearchActive = React.createClass({
  render: function() {
    return (
      <div style={fetchResultsStyle}>
        Looking up the Dewey Decimals
        <span className="busy-indicator"></span>
      </div>
    );
  }
});

var searchNoResultsStyle = {
  textAlign: 'center'
}, searchNoResultsMessageStyle = {
  fontStyle: 'italic',
  marginRight: '5px'
};

var SearchNoResults = React.createClass({
  render: function() {
    return (
      <section style={searchNoResultsStyle}>
        <span style={searchNoResultsMessageStyle}>No one has checked anything in for {this.props.query} yet.</span>
        <Link label="Be the first" href="?publish" />
      </section>
    );
  }
});

var SearchResults = React.createClass({
  render: function() {
    var rows = [];
    this.props.results.forEach(function(result) {
      rows.push(
        <SearchResultRow key={result.name} name={result.name} title={result.title} imgUrl={result.thumbnail}
                         description={result.description} cost_est={result.cost_est} />
      );
    });
    return (
      <div>{rows}</div>
    );
  }
});

var
  searchRowStyle = {
    height: '160px',
    overflowY: 'hidden'
  },
  searchRowImgStyle = {
    maxWidth: '100%',
    maxHeight: '16  0px',
    display: 'block',
    marginLeft: 'auto',
    marginRight: 'auto',
    float: 'left'
  },
  searchRowTitleStyle = {
    fontWeight: 'bold'
  },
  searchRowCostStyle = {
    float: 'right',
  },
  searchRowDescriptionStyle = {
    color : '#444',
    marginBottom: '24px',
    marginTop: '12px',
    fontSize: '0.9em'
  };


var SearchResultRow = React.createClass({
  getInitialState: function() {
    return {
      downloading: false
    }
  },
  render: function() {
    return (

      <section className="card">
        <div className="row-fluid" style={searchRowStyle}>
          <div className="span3">
            <img src={this.props.imgUrl} alt={'Photo for ' + (this.props.title || this.props.name)} style={searchRowImgStyle} />
          </div>
          <div className="span9">
            <span style={searchRowCostStyle}>
              <CreditAmount amount={this.props.cost_est} isEstimate={true}/>
            </span>
            <div className="meta">lbry://{this.props.name}</div>
            <h3 style={searchRowTitleStyle}><a href={'/?show=' + this.props.name}>{this.props.title}</a></h3>
            <div>
              <WatchLink streamName={this.props.name} button="primary" />
              <DownloadLink streamName={this.props.name} button="text" />
            </div>
            <p style={searchRowDescriptionStyle}>{this.props.description}</p>
          </div>
        </div>
      </section>
    );
  }
});



var FeaturedContentItem = React.createClass({
  propTypes: {
    name: React.PropTypes.string,
  },

  getInitialState: function() {
    return {
      metadata: null,
      title: null,
      amount: 0.0,
    };
  },

  componentWillMount: function() {
    lbry.resolveName(this.props.name, (metadata) => {
      this.setState({
        metadata: metadata,
        title: metadata && metadata.title ? metadata.title : ('lbry://' + this.props.name),
      })
    });
    lbry.getCostEstimate(this.props.name, (amount) => {
      this.setState({
        amount: amount,
      });
    });
  },

  render: function() {
    if (this.state.metadata == null) {
      // Still waiting for metadata
      return null;
    }
    return <SearchResultRow name={this.props.name} title={this.state.title} imgUrl={this.state.metadata.thumbnail}
                     description={this.state.metadata.description} cost_est={this.state.amount} />;
  }
});

var featuredContentLegendStyle = {
  fontSize: '12px',
  color: '#aaa',
  verticalAlign: '15%',
};

var FeaturedContent = React.createClass({
  render: function() {
    return (
      <div className="row-fluid">
        <div className="span6">
          <h3>Featured Content</h3>
          <FeaturedContentItem name="what" />
          <FeaturedContentItem name="itsadisaster" />
          <FeaturedContentItem name="keynesvhayek" />
          <FeaturedContentItem name="meetlbry1" />
        </div>
        <div className="span6">
          <h3>Community Content <ToolTipLink style={featuredContentLegendStyle} label="What's this?"
            tooltip='Community Content is a public space where anyone can share content with the rest of the LBRY community. Bid on the names "one," "two," "three" and "four" to put your content here!' /></h3>
          <FeaturedContentItem name="one" />
          <FeaturedContentItem name="two" />
          <FeaturedContentItem name="three" />
          <FeaturedContentItem name="four" />
        </div>
      </div>
    );
  }
});

var DiscoverPage = React.createClass({
  userTypingTimer: null,

  componentDidUpdate: function() {
    if (this.props.query)
    {
      lbry.search(this.props.query, this.searchCallback);
    }
  },

  componentDidMount: function() {
    document.title = "Discover";
  },

  getInitialState: function() {
    return {
      results: [],
      query: this.props.query,
      searching: this.props.query && this.props.query.length > 0
    };
  },

  searchCallback: function(results) {
    console.log('search callback');
    console.log(this.state);
    console.log(this.props);
    if (this.state.searching) //could have canceled while results were pending, in which case nothing to do
    {
      this.setState({
        results: results,
        searching: false //multiple searches can be out, we're only done if we receive one we actually care about
      });
    }
  },

  render: function() {
    return (
      <main>
        { this.state.searching ? <SearchActive /> : null }
        { !this.state.searching && this.props.query && this.state.results.length ? <SearchResults results={this.state.results} /> : null }
        { !this.state.searching && this.props.query && !this.state.results.length ? <SearchNoResults query={this.props.query} /> : null }
        { !this.props.query && !this.state.searching ? <FeaturedContent /> : null }
      </main>
    );
  }
});