import React from 'react';
import lbry from '../lbry.js';
import lighthouse from '../lighthouse.js';
import FileTile from '../component/file-tile.js';
import {Link, ToolTipLink, DownloadLink, WatchLink} from '../component/link.js';
import {Thumbnail, CreditAmount, TruncatedText, BusyMessage} from '../component/common.js';

var fetchResultsStyle = {
    color: '#888',
    textAlign: 'center',
    fontSize: '1.2em'
  };

var SearchActive = React.createClass({
  render: function() {
    return (
      <div style={fetchResultsStyle}>
        <BusyMessage message="Looking up the Dewey Decimals" />
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
    this.props.results.forEach(function({name, value}) {
      rows.push(
        <FileTile key={name} name={name} sdHash={value.sources.lbry_sd_hash} metadata={value} />
      );
    });
    return (
      <div>{rows}</div>
    );
  }
});

var featuredContentItemContainerStyle = {
  position: 'relative',
};

var FeaturedContentItem = React.createClass({
  resolveSearch: false,

  propTypes: {
    name: React.PropTypes.string,
  },

  getInitialState: function() {
    return {
      metadata: null,
      title: null,
      cost: null,
      overlayShowing: false,
    };
  },

  componentWillUnmount: function() {
    this.resolveSearch = false;
  },

  componentDidMount: function() {
    this._isMounted = true;

    lbry.resolveName(this.props.name, (metadata) => {
      if (!this._isMounted) {
        return;
      }

      this.setState({
        metadata: metadata,
        title: metadata && metadata.title ? metadata.title : ('lbry://' + this.props.name),
      });
    });
  },

  render: function() {
    if (this.state.metadata === null) {
      // Still waiting for metadata, skip render
      return null;
    }

    return (<div style={featuredContentItemContainerStyle}>
      <FileTile name={this.props.name} metadata={this.state.metadata} compact />
    </div>);
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
          <FeaturedContentItem name="bellflower" />
          <FeaturedContentItem name="itsadisaster" />
          <FeaturedContentItem name="dopeman" />
          <FeaturedContentItem name="smlawncare" />
          <FeaturedContentItem name="cinemasix" />

        </div>
        <div className="span6">
          <h3>Community Content <ToolTipLink style={featuredContentLegendStyle} label="What's this?"
            tooltip='Community Content is a public space where anyone can share content with the rest of the LBRY community. Bid on the names "one," "two," "three," "four" and "five" to put your content here!' /></h3>
          <FeaturedContentItem name="one" />
          <FeaturedContentItem name="two" />
          <FeaturedContentItem name="three" />
          <FeaturedContentItem name="four" />
          <FeaturedContentItem name="five" />
        </div>
      </div>
    );
  }
});

var DiscoverPage = React.createClass({
  userTypingTimer: null,

  componentDidUpdate: function() {
    if (this.props.query != this.state.query)
    {
      this.handleSearchChanged(this.props.query);
    }
  },

  componentWillReceiveProps: function(nextProps, nextState) {
    if (nextProps.query != nextState.query)
    {
      this.handleSearchChanged(nextProps.query);
    }
  },

  handleSearchChanged: function(query) {
    this.setState({
      searching: true,
      query: query,
    });

    lighthouse.search(query, this.searchCallback);
  },

  componentWillMount: function() {
    document.title = "Discover";
    if (this.props.query) {
      // Rendering with a query already typed
      this.handleSearchChanged(this.props.query);
    }
  },

  getInitialState: function() {
    return {
      results: [],
      query: this.props.query,
      searching: ('query' in this.props) && (this.props.query.length > 0)
    };
  },

  searchCallback: function(results) {
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

export default DiscoverPage;
