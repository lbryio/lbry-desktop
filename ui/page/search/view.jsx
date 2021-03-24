// @flow
import { SIMPLE_SITE, SHOW_ADS } from 'config';
import * as ICONS from 'constants/icons';
import React, { useEffect } from 'react';
import { Lbry, parseURI, isNameValid } from 'lbry-redux';
import ClaimList from 'component/claimList';
import Page from 'component/page';
import SearchOptions from 'component/searchOptions';
import Button from 'component/button';
import Ads from 'web/component/ads';
import SearchTopClaim from 'component/searchTopClaim';
import { formatLbryUrlForWeb } from 'util/url';
import { useHistory } from 'react-router';
import ClaimPreview from 'component/claimPreview';

type AdditionalOptions = {
  isBackgroundSearch: boolean,
  nsfw?: boolean,
};

type Props = {
  search: (string, AdditionalOptions) => void,
  searchOptions: {},
  isSearching: boolean,
  location: UrlLocation,
  uris: Array<string>,
  onFeedbackNegative: (string) => void,
  onFeedbackPositive: (string) => void,
  showNsfw: boolean,
  isAuthenticated: boolean,
};

export default function SearchPage(props: Props) {
  const {
    search,
    uris,
    onFeedbackPositive,
    onFeedbackNegative,
    location,
    isSearching,
    showNsfw,
    isAuthenticated,
    searchOptions,
  } = props;
  const { push } = useHistory();
  const urlParams = new URLSearchParams(location.search);
  const urlQuery = urlParams.get('q') || '';
  const additionalOptions: AdditionalOptions = { isBackgroundSearch: false };

  additionalOptions['nsfw'] = showNsfw;

  const modifiedUrlQuery = urlQuery.trim().replace(/\s+/g, '').replace(/:/g, '#');
  const uriFromQuery = `lbry://${modifiedUrlQuery}`;

  let streamName;
  let isValid = true;
  try {
    ({ streamName } = parseURI(uriFromQuery));
    if (!isNameValid(streamName)) {
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

  const stringifiedOptions = JSON.stringify(additionalOptions);
  const stringifiedSearchOptions = JSON.stringify(searchOptions);
  useEffect(() => {
    if (urlQuery) {
      const jsonOptions = JSON.parse(stringifiedOptions);
      search(urlQuery, jsonOptions);
    }
  }, [search, urlQuery, stringifiedOptions, stringifiedSearchOptions]);

  return (
    <Page>
      <section className="search">
        {urlQuery && (
          <>
            {isValid && <SearchTopClaim query={modifiedUrlQuery} isSearching={isSearching} />}
            <ClaimList
              uris={uris}
              loading={isSearching}
              header={<SearchOptions simple={SIMPLE_SITE} additionalOptions={additionalOptions} />}
              injectedItem={
                SHOW_ADS && IS_WEB ? (SIMPLE_SITE ? false : !isAuthenticated && <Ads small type={'video'} />) : false
              }
              headerAltControls={
                <>
                  <span>{__('Find what you were looking for?')}</span>
                  <Button
                    button="alt"
                    description={__('Yes')}
                    onClick={() => onFeedbackPositive(urlQuery)}
                    icon={ICONS.YES}
                  />
                  <Button
                    button="alt"
                    description={__('No')}
                    onClick={() => onFeedbackNegative(urlQuery)}
                    icon={ICONS.NO}
                  />
                </>
              }
            />
            {isSearching && new Array(5).fill(1).map((x, i) => <ClaimPreview key={i} placeholder="loading" />)}

            <div className="main--empty help">{__('These search results are provided by LBRY, Inc.')}</div>
          </>
        )}
      </section>
    </Page>
  );
}
