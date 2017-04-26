import React from 'react';
import lbry from 'lbry.js';
import lbryio from 'lbryio.js';
import lbryuri from 'lbryuri.js';
import lighthouse from 'lighthouse.js';
import FileTile from 'component/fileTile';
import FileTileStream from 'component/fileTileStream'
import Link from 'component/link';
import {ToolTip} from 'component/tooltip.js';
import {BusyMessage} from 'component/common.js';

const fetchResultsStyle = {
  color: '#888',
  textAlign: 'center',
  fontSize: '1.2em'
}

const SearchActive = (props) => {
  return (
    <div style={fetchResultsStyle}>
      <BusyMessage message="Looking up the Dewey Decimals" />
    </div>
  )
}

const searchNoResultsStyle = {
  textAlign: 'center'
}, searchNoResultsMessageStyle = {
  fontStyle: 'italic',
  marginRight: '5px'
};

const SearchNoResults = (props) => {
  const {
    query,
  } = props

  return (
    <section style={searchNoResultsStyle}>
      <span style={searchNoResultsMessageStyle}>No one has checked anything in for {query} yet.</span>
      <Link label="Be the first" href="?publish" />
    </section>
  )
}

const SearchResults = (props) => {
  const {
    results
  } = props

  const rows = [],
      seenNames = {}; //fix this when the search API returns claim IDs

  for (let {name, claim, claim_id, channel_name, channel_id, txid, nout} of results) {
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
  )
}

const communityCategoryToolTipText = ('Community Content is a public space where anyone can share content with the ' +
'rest of the LBRY community. Bid on the names "one," "two," "three," "four" and ' +
'"five" to put your content here!');

const FeaturedCategory = (props) => {
  const {
    category,
    resolvedUris,
    names,
  } = props

  return (
    <div className="card-row card-row--small">
      <h3 className="card-row__header">{category}
        {category &&
          <ToolTip label="What's this?" body={communityCategoryToolTipText} className="tooltip--header" />}
      </h3>
      {names && names.map(name => <FileTile key={name} displayStyle="card" uri={name} />)}
    </div>
  )
}

const FeaturedContent = (props) => {
  const {
    featuredContentByCategory,
    resolvedUris,
  } = props

  const categories = Object.keys(featuredContentByCategory)

  return (
    <div>
      {categories.map(category =>
        <FeaturedCategory key={category} category={category} names={featuredContentByCategory[category]} resolvedUris={resolvedUris} />
      )}
    </div>
  )
}

const DiscoverPage = (props) => {
  const {
    isSearching,
    query,
    results,
  } = props

  return (
    <main>
      { !isSearching && !query && <FeaturedContent {...props} /> }
      { isSearching ? <SearchActive /> : null }
      { !isSearching && query && results.length ? <SearchResults results={results} /> : null }
      { !isSearching && query && !results.length ? <SearchNoResults query={query} /> : null }
    </main>
  );
}

export default DiscoverPage;
