import React from 'react';
import lbry from 'lbry';
import lbryio from 'lbryio';
import lbryuri from 'lbryuri';
import lighthouse from 'lighthouse';
import FileTile from 'component/fileTile'
import Link from 'component/link'
import {ToolTip} from 'component/tooltip.js';
import {BusyMessage} from 'component/common.js';

const SearchNoResults = (props) => {
  const {
    navigate,
    query,
  } = props

  return <section>
    <span className="empty">
      No one has checked anything in for {query} yet. { ' ' }
      <Link label="Be the first" onClick={() => navigate('/publish')} />
    </span>
  </section>;
}

const SearchResultList = (props) => {
  const {
    results,
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
      <FileTile key={uri} uri={uri} />
    );
  }
  return (
    <div>{rows}</div>
  );
}

const SearchResults = (props) => {
  const {
    isSearching,
    results
  } = props

  return (
    isSearching ?
     <BusyMessage message="Looking up the Dewey Decimals" /> :
     (results && results.length) ?
        <SearchResultList {...props} /> :
        <SearchNoResults {...props} />
  )
}

const SearchPage = (props) => {
  const isValidUri = (query) => true
  const {
    query,
  } = props
//        <SearchResults {...props} />
  return (
    <main className="main--single-column">
      { isValidUri(query) ?
        <section className="section-spaced">
          <h3 className="card-row__header">
            Exact URL
            <ToolTip label="?" body="This is the resolution of a LBRY URL and not controlled by LBRY Inc." className="tooltip--header" />
          </h3>
          <FileTile uri={query} showEmpty={true} />
        </section> : '' }
      <section className="section-spaced">
        <h3 className="card-row__header">
          Search Results for {query}
          <ToolTip label="?" body="These search results are provided by LBRY, Inc." className="tooltip--header" />
        </h3>

      </section>
    </main>
  )
}
export default SearchPage;
