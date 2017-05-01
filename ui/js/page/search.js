import React from 'react';
import lbry from '../lbry.js';
import lbryio from '../lbryio.js';
import lbryuri from '../lbryuri.js';
import lighthouse from '../lighthouse.js';
import {FileTile, FileTileStream} from '../component/file-tile.js';
import {Link} from '../component/link.js';
import {ToolTip} from '../component/tooltip.js';
import {BusyMessage} from '../component/common.js';

var SearchNoResults = React.createClass({
  render: function() {
    return <section>
      <span className="empty">
        No one has checked anything in for {this.props.query} yet.
        <Link label="Be the first" href="?publish" />
      </span>
    </section>;
  }
});

var SearchResultList = React.createClass({
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
        <FileTileStream key={uri} uri={uri} outpoint={txid + ':' + nout} metadata={claim.stream.metadata} contentType={claim.stream.source.contentType} />
      );
    }
    return (
      <div>{rows}</div>
    );
  }
});

let SearchResults = React.createClass({
  propTypes: {
    query: React.PropTypes.string.isRequired
  },

  _isMounted: false,

  componentWillMount: function () {
    this._isMounted = true;
    lighthouse.search(this.props.query).then(this.searchCallback);
  },

  componentWillUnmount: function () {
    this._isMounted = false;
  },

  getInitialState: function () {
    return {
      results: [],
      searching: true
    };
  },

  searchCallback: function (results) {
    if (this._isMounted) //could have canceled while results were pending, in which case nothing to do
    {
      this.setState({
        results: results,
        searching: false //multiple searches can be out, we're only done if we receive one we actually care about
      });
    }
  },

  render: function () {
    return this.state.searching ?
       <BusyMessage message="Looking up the Dewey Decimals" /> :
       (this.state.results.length ?
          <SearchResultList results={this.state.results} /> :
          <SearchNoResults query={thisprops.query} />);
  }
});

let SearchPage = React.createClass({

  _isMounted: false,

  propTypes: {
    query: React.PropTypes.string.isRequired
  },

  isValidUri: function(query) {
    return true;
  },

  componentWillMount: function() {
    this._isMounted = true;
    lighthouse.search(this.props.query).then(this.searchCallback);
  },

  componentWillUnmount: function() {
    this._isMounted = false;
  },

  getInitialState: function() {
    return {
      results: [],
      searching: true
    };
  },

  searchCallback: function(results) {
    if (this._isMounted) //could have canceled while results were pending, in which case nothing to do
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
        { this.isValidUri(this.props.query) ?
          <div>
            <h3>lbry://{this.props.query}</h3>
            <div><BusyMessage message="Resolving the URL" /></div>
          </div> : '' }
        <h3>Search</h3>
        <SearchResults query={this.props.query} />
      </main>
    );
  }
});

export default SearchPage;
