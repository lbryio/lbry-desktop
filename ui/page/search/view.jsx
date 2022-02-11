// @flow
import { SIMPLE_SITE, SHOW_ADS } from 'config';
import React, { useEffect } from 'react';
import Lbry from 'lbry';
import { parseURI, isNameValid } from 'util/lbryURI';
import ClaimList from 'component/claimList';
import Page from 'component/page';
import SearchOptions from 'component/searchOptions';
import Ads from 'web/component/ads';
import SearchTopClaim from 'component/searchTopClaim';
import { formatLbryUrlForWeb } from 'util/url';
import { useHistory } from 'react-router';
import { SEARCH_PAGE_SIZE } from 'constants/search';

type Props = {
  urlQuery: string,
  searchOptions: SearchOptions,
  search: (string, SearchOptions) => void,
  isSearching: boolean,
  uris: Array<string>,
  isAuthenticated: boolean,
  hasReachedMaxResultsLength: boolean,
};

export default function SearchPage(props: Props) {
  const { urlQuery, searchOptions, search, uris, isSearching, isAuthenticated, hasReachedMaxResultsLength } = props;
  const { push } = useHistory();
  const [from, setFrom] = React.useState(0);

  const modifiedUrlQuery = urlQuery.trim().replace(/\s+/g, '').replace(/:/g, '#');
  const uriFromQuery = `lbry://${modifiedUrlQuery}`;

  let streamName;
  let channelName;
  let isValid = true;
  try {
    ({ streamName, channelName } = parseURI(uriFromQuery));
    if (
      (!streamName && !channelName) ||
      (streamName && !isNameValid(streamName)) ||
      (channelName && !isNameValid(channelName))
    ) {
      isValid = false;
    }
  } catch (e) {
    isValid = false;
  }

  let claimId;
  // Navigate directly to a claim if a claim_id is pasted into the search bar
  if (!/\s/.test(urlQuery) && urlQuery.length === 40) {
    try {
      const dummyUrlForClaimId = `x#${urlQuery}`;
      ({ claimId } = parseURI(dummyUrlForClaimId));
      Lbry.claim_search({ claim_id: claimId }).then((res) => {
        if (res.items && res.items.length) {
          const claim = res.items[0];
          const url = formatLbryUrlForWeb(claim.canonical_url);
          push(url);
        }
      });
    } catch (e) {}
  }

  const stringifiedSearchOptions = JSON.stringify(searchOptions);

  useEffect(() => {
    if (urlQuery) {
      const searchOptions = JSON.parse(stringifiedSearchOptions);
      search(urlQuery, { ...searchOptions, from: from });
    }
  }, [search, urlQuery, stringifiedSearchOptions, from]);

  function loadMore() {
    if (!isSearching && !hasReachedMaxResultsLength) {
      setFrom(from + SEARCH_PAGE_SIZE);
    }
  }

  function resetPage() {
    setFrom(0);
  }

  return (
    <Page className="searchPage-wrapper">
      <section className="search">
        {urlQuery && (
          <>
            {isValid && <SearchTopClaim query={modifiedUrlQuery} isSearching={isSearching} />}
            <ClaimList
              uris={uris}
              loading={isSearching}
              onScrollBottom={loadMore}
              // 'page' is 1-indexed; It's not the same as 'from', but it just
              // needs to be unique to indicate when a fetch is needed.
              page={from + 1}
              pageSize={SEARCH_PAGE_SIZE}
              header={
                <SearchOptions
                  simple={SIMPLE_SITE}
                  additionalOptions={searchOptions}
                  onSearchOptionsChanged={resetPage}
                />
              }
              injectedItem={
                SHOW_ADS && IS_WEB ? (SIMPLE_SITE ? false : !isAuthenticated && <Ads small type={'video'} />) : false
              }
            />

            <div className="main--empty help">{__('These search results are provided by Odysee.')}</div>
          </>
        )}
      </section>
    </Page>
  );
}
