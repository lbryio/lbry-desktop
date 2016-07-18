var searchInputStyle = {
    width: '400px',
    display: 'block',
    marginBottom: '48px',
    marginLeft: 'auto',
    marginRight: 'auto'
  },
  fetchResultsStyle = {
    color: '#888',
    textAlign: 'center',
    fontSize: '1.2em'
  };

var SearchActive = React.createClass({
  render: function() {
    return (
      <section style={fetchResultsStyle}>
        Looking up the Dewey Decimals
        <span className="busy-indicator"></span>
      </section>
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
        <Link label="Be the first" href="javascript:alert('aww I do nothing')" />
      </section>
    );
  }
});

var SearchResults = React.createClass({
  render: function() {
    var rows = [];
    this.props.results.forEach(function(result) {
      rows.push(
        <SearchResultRow name={result.name} title={result.title} imgUrl={result.thumbnail}
                         description={result.description} cost_est={result.cost_est} />
      );
    });
    return (
      <section>{rows}</section>
    );
  }
});

var
  searchRowImgStyle = {
    maxWidth: '100%',
    maxHeight: '250px',
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
    marginLeft: '20px',
    marginTop: '5px',
    display: 'inline-block'
  },
  searchRowNameStyle = {
    fontSize: '0.9em',
    color: '#666',
    marginBottom: '24px',
    clear: 'both'
  },
  searchRowDescriptionStyle = {
    color : '#444',
    marginBottom: '24px',
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
      <div className="row-fluid">
        <div className="span3">
          <img src={this.props.imgUrl} alt={'Photo for ' + (this.props.title || this.props.name)} style={searchRowImgStyle} />
        </div>
        <div className="span9">
          <span style={searchRowCostStyle}>
            <CreditAmount amount={this.props.cost_est} isEstimate={true}/>
          </span>
          <h2 style={searchRowTitleStyle}><a href={'/?show=' + this.props.name}>{this.props.title}</a></h2>
          <div style={searchRowNameStyle}>lbry://{this.props.name}</div>
          <p style={searchRowDescriptionStyle}>{this.props.description}</p>
          <div>
            <WatchLink streamName={this.props.name} button="primary" />
            <DownloadLink streamName={this.props.name} button="alt" />
          </div>
        </div>
      </div>
    );
  }
});

var featuredContentItemStyle = {
  fontSize: '0.95em',
  marginTop: '10px',
  maxHeight: '220px'
}, featuredContentItemImgStyle = {
  maxWidth: '100%',
  maxHeight: '100%',
  display: 'block',
  marginLeft: 'auto',
  marginRight: 'auto',
  marginTop: '5px',
}, featuredContentHeaderStyle = {
  fontWeight: 'bold',
  marginBottom: '5px'
}, featuredContentSubheaderStyle = {
  marginBottom: '10px',
  fontSize: '0.9em'
}, featuredContentItemDescriptionStyle = {
  color: '#444',
  marginBottom: '5px',
  fontSize: '0.9em',
}, featuredContentItemCostStyle = {
  float: 'right'
};

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
        title: metadata.title || ('lbry://' + this.props.name),
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

    var metadata = this.state.metadata;

    if ('narrow' in this.props) {
      // Workaround -- narrow thumbnails look a bit funky without some extra left margin.
      // Find a way to do this in CSS.

      var thumbStyle = Object.assign({}, featuredContentItemImgStyle, {
        position: 'relative',
        maxHeight: '102px',
        left: '13px',
      });
    } else {
      var thumbStyle = featuredContentItemImgStyle;
    }

    return (
      <div className="row-fluid" style={featuredContentItemStyle}>
        <div className="span4">
          <img src={metadata.thumbnail} alt={'Photo for ' + this.state.title} style={thumbStyle} />
        </div>
        <div className="span8">
          <h4 style={featuredContentHeaderStyle}><a href={'/?show=' + this.props.name}>{this.state.title}</a></h4>
          <div style={featuredContentSubheaderStyle}>
            <div style={featuredContentItemCostStyle}><CreditAmount amount={this.state.amount} isEstimate={true}/></div>
            <WatchLink streamName={this.props.name} />
            &nbsp;&nbsp;&nbsp;
            <DownloadLink streamName={this.props.name} />
          </div>
          <p style={featuredContentItemDescriptionStyle}>{metadata.description}</p>
        </div>
      </div>);
  }
});

var featuredContentStyle = {
  width: '100%',
  marginTop: '-8px',
};

var FeaturedContent = React.createClass({
  render: function() {
    return (<section style={featuredContentStyle}>
    <h3>Featured Content</h3>
      <div className="row-fluid">
        <div className="span6">
          <FeaturedContentItem name="what" />
        </div>
        <div className="span6">
          <FeaturedContentItem name="itsadisaster" narrow />
        </div>
      </div>
      <div className="row-fluid">
        <div className="span6">
          <FeaturedContentItem name="keynesvhayek" />
        </div>
        <div className="span6">
          <FeaturedContentItem name="meetlbry1" />
        </div>
      </div>
    </section>);
  }
});

var discoverMainStyle = {
  color: '#333'
};

var Discover = React.createClass({
  userTypingTimer: null,

  getInitialState: function() {
    return {
      results: [],
      searching: false,
      query: ''
    };
  },

  search: function() {
    if (this.state.query)
    {
      console.log('search');
      lbry.search(this.state.query, this.searchCallback.bind(this, this.state.query));
    }
    else
    {
      this.setState({
        searching: false,
        results: []
      });
    }
  },

  searchCallback: function(originalQuery, results) {
    if (this.state.searching) //could have canceled while results were pending, in which case nothing to do
    {
      this.setState({
        results: results,
        searching: this.state.query != originalQuery, //multiple searches can be out, we're only done if we receive one we actually care about
      });
    }
  },

  onQueryChange: function(event) {
    if (this.userTypingTimer)
    {
      clearTimeout(this.userTypingTimer);
    }

    //@TODO: Switch to React.js timing
    this.userTypingTimer = setTimeout(this.search, 800); // 800ms delay, tweak for faster/slower

    this.setState({
      searching: event.target.value.length > 0,
      query: event.target.value
    });
  },

  render: function() {
    console.log(this.state);
    return (
      <main style={discoverMainStyle}>
        <section><input type="search" style={searchInputStyle} onChange={this.onQueryChange}
                        placeholder="Find movies, music, games, and more"/></section>
        { this.state.searching ? <SearchActive /> : null }
        { !this.state.searching && this.state.query && this.state.results.length ? <SearchResults results={this.state.results} /> : null }
        { !this.state.searching && this.state.query && !this.state.results.length ? <SearchNoResults query={this.state.query} /> : null }
        { !this.state.query && !this.state.searching ? <FeaturedContent /> : null }
      </main>
    );
  }
});

var logoStyle = {
    padding: '48px 12px',
    textAlign: 'center',
    maxHeight: '80px',
  },
  imgStyle = { //@TODO: remove this, img should be properly scaled once size is settled
    height: '80px'
  };

var Header = React.createClass({
  render: function() {
    return (
      <header>
        <TopBar />
        <div style={logoStyle}>
          <img src="./img/lbry-dark-1600x528.png" style={imgStyle}/>
        </div>
      </header>
    );
  }
});

var topBarStyle = {
  'float': 'right',
  'position': 'relative',
  'height': '26px',
},
balanceStyle = {
  'marginRight': '5px',
  'position': 'relative',
  'top': '1px',
};

var mainMenuStyle = {
  position: 'absolute',
  top: '26px',
  right: '0px',
};

var MainMenu = React.createClass({
  render: function() {
    var isLinux = /linux/i.test(navigator.userAgent); // @TODO: find a way to use getVersionInfo() here without messy state management
    return (
      <div style={mainMenuStyle}>
        <Menu {...this.props}>
          <MenuItem href='/?files' label="My Files" icon='icon-cloud-download' />
          <MenuItem href='/?settings' label="Settings" icon='icon-gear' />
          <MenuItem href='/?help' label="Help" icon='icon-question-circle' />
          {isLinux ? <MenuItem href="/?start" label="Exit LBRY" icon="icon-close" />
                   : null}
        </Menu>
      </div>
    );
  }
});

var TopBar = React.createClass({
  getInitialState: function() {
    return {
      balance: 0,
    };
  },
  componentDidMount: function() {
    lbry.getBalance(function(balance) {
      this.setState({
        balance: balance
      });
    }.bind(this));
  },
  onClose: function() {
    window.location.href = "?start";
  },
  render: function() {
    return (
      <span className='top-bar' style={topBarStyle}>
        <span style={balanceStyle}>
          <CreditAmount amount={this.state.balance}/>
        </span>
        <Link ref="menuButton" title="LBRY Menu" icon="icon-bars" />
        <MainMenu toggleButton={this.refs.menuButton} />
      </span>
    );
  }
});

var HomePage = React.createClass({
  componentDidMount: function() {
    lbry.getStartNotice(function(notice) {
      if (notice) {
        alert(notice);
      }
    });
  },
  render: function() {
    return (
      <div className="page">
        <Header />
        <Discover />
      </div>
    );
  }
});
