import React from 'react';
import lbry from '../lbry.js';
import lighthouse from '../lighthouse.js';
import {FileTile} from '../component/file-tile.js';
import {Link} from '../component/link.js';
import {ToolTip} from '../component/tooltip.js';
import {BusyMessage} from '../component/common.js';
import {Welcome} from '../component/welcome.js';

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
    var rows = [],
        seenNames = {}; //fix this when the search API returns claim IDs
    this.props.results.forEach(function({name, value}) {
      if (!seenNames[name]) {
        seenNames[name] = name;
        rows.push(
          <FileTile key={name} uri={name} sdHash={value.sources.lbry_sd_hash} />
        );
      }
    });
    return (
      <div>{rows}</div>
    );
  }
});

var featuredContentLegendStyle = {
  fontSize: '12px',
  color: '#aaa',
  verticalAlign: '15%',
};

var FeaturedContent = React.createClass({
  getInitialState: function() {
    return {
      featuredNames: [],
    };
  },
  componentWillMount: function() {
    lbry.getFeaturedDiscoverNames().then((featuredNames) => {
      this.setState({ featuredNames: featuredNames });
    });
  },
  render: function() {
    const toolTipText = ('Community Content is a public space where anyone can share content with the ' +
                        'rest of the LBRY community. Bid on the names "one," "two," "three," "four" and ' +
                        '"five" to put your content here!');

    return (
      <div className="row-fluid">
        <div className="span6">
          <h3>Featured Content</h3>
          { this.state.featuredNames.map(name => <FileTile key={name} uri={name} />) }
        </div>
        <div className="span6">
          <h3>
            Community Content
            <ToolTip label="What's this?" body={toolTipText} className="tooltip--header"/>
          </h3>
          <FileTile uri="one" />
          <FileTile uri="two" />
          <FileTile uri="three" />
          <FileTile uri="four" />
          <FileTile uri="five" />
        </div>
      </div>
    );
  }
});

var DiscoverPage = React.createClass({
  userTypingTimer: null,

  propTypes: {
    showWelcome: React.PropTypes.bool.isRequired,
  },

  componentDidUpdate: function() {
    if (this.props.query != this.state.query)
    {
      this.handleSearchChanged(this.props.query);
    }
  },

  getDefaultProps: function() {
    return {
      showWelcome: false,
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

    lighthouse.search(query).then(this.searchCallback);
  },

  handleWelcomeDone: function() {
    this.setState({
      welcomeComplete: true,
    });
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
      welcomeComplete: false,
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
        <Welcome isOpen={this.props.showWelcome && !this.state.welcomeComplete} onDone={this.handleWelcomeDone} />
      </main>
    );
  }
});

export default DiscoverPage;
