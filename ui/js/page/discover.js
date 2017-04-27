import React from 'react';
import lbry from '../lbry.js';
import lbryio from '../lbryio.js';
import lbryuri from '../lbryuri.js';
import lighthouse from '../lighthouse.js';
import {FileTile, FileTileStream} from '../component/file-tile.js';
import {Link} from '../component/link.js';
import {ToolTip} from '../component/tooltip.js';
import {BusyMessage} from '../component/common.js';

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

    for (let {name, claim, claim_id, channel_name, channel_id, txid, nout} of this.props.results) {
      const uri = lbryuri.build({
        channelName: channel_name,
        contentName: name,
        claimId: channel_id || claim_id,
      });

      rows.push(
        <FileTileStream key={name} uri={uri} outpoint={txid + ':' + nout} metadata={claim.stream.metadata} contentType={claim.stream.source.contentType} />
      );
    }
    return (
      <div>{rows}</div>
    );
  }
});

const communityCategoryToolTipText = ('Community Content is a public space where anyone can share content with the ' +
'rest of the LBRY community. Bid on the names "one," "two," "three," "four" and ' +
'"five" to put your content here!');

var FeaturedCategory = React.createClass({
  render: function() {
    return (<div className="card-row card-row--small">
        { this.props.category ?
          <h3 className="card-row__header">{this.props.category}
            { this.props.category == "community" ?
              <ToolTip label="What's this?" body={communityCategoryToolTipText} className="tooltip--header"/>
              : '' }</h3>
          : '' }
        { this.props.names.map((name) => { return <FileTile key={name} displayStyle="card" uri={name} /> }) }
    </div>)
  }
})

var FeaturedContent = React.createClass({
  getInitialState: function() {
    return {
      featuredUris: {},
      failed: false
    };
  },
  componentWillMount: function() {
    lbryio.call('discover', 'list', { version: "early-access" } ).then(({Categories, Uris}) => {
      let featuredUris = {}
      Categories.forEach((category) => {
        if (Uris[category] && Uris[category].length) {
          featuredUris[category] = Uris[category]
        }
      })
      this.setState({ featuredUris: featuredUris });
    }, () => {
      this.setState({
        failed: true
      })
    });
  },
  render: function() {
    return (
      this.state.failed ?
        <div className="empty">Failed to load landing content.</div> :
        <div>
          {
              Object.keys(this.state.featuredUris).map((category) => {
                return this.state.featuredUris[category].length ?
                       <FeaturedCategory key={category} category={category} names={this.state.featuredUris[category]} /> :
                       '';
              })
          }
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
    document.title = "Home";

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
      </main>
    );
  }
});

export default DiscoverPage;
