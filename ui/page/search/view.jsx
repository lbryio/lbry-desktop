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

type AdditionalOptions = {
  isBackgroundSearch: boolean,
  nsfw?: boolean,
};

type Props = {
  search: (string, AdditionalOptions) => void,
  isSearching: boolean,
  location: UrlLocation,
  uris: Array<string>,
  onFeedbackNegative: string => void,
  onFeedbackPositive: string => void,
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
    //  showNsfw,
    isAuthenticated,
  } = props;
  const { push } = useHistory();
  const urlParams = new URLSearchParams(location.search);
  const urlQuery = urlParams.get('q') || '';
  const additionalOptions: AdditionalOptions = {
    isBackgroundSearch: false,
  };
  //   if (!showNsfw) {
  additionalOptions['nsfw'] = false;
  //  }

  const modifiedUrlQuery = urlQuery
    .trim()
    .replace(/\s+/g, '')
    .replace(/:/g, '#');
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
      Lbry.claim_search({ claim_id: claimId }).then(res => {
        if (res.items && res.items.length) {
          const claim = res.items[0];
          const url = formatLbryUrlForWeb(claim.canonical_url);
          push(url);
        }
      });
    } catch (e) {}
  }

  const stringifiedOptions = JSON.stringify(additionalOptions);
  useEffect(() => {
    if (urlQuery) {
      const jsonOptions = JSON.parse(stringifiedOptions);
      search(urlQuery, jsonOptions);
    }
  }, [search, urlQuery, stringifiedOptions]);

  return (
    <Page>
      <section className="search">
        {urlQuery && (
          <>
            {isValid && <SearchTopClaim query={modifiedUrlQuery} />}

            <ClaimList
              uris={uris}
              loading={isSearching}
              header={!SIMPLE_SITE && <SearchOptions additionalOptions={additionalOptions} />}
              injectedItem={SHOW_ADS && !isAuthenticated && IS_WEB && <Ads type="video" />}
              headerAltControls={
                !SIMPLE_SITE && (
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
                )
              }
            />

            <div className="main--empty help">{__('These search results are provided by LBRY, Inc.')}</div>
          </>
        )}
      </section>
    </Page>
  );
}
