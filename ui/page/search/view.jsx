// @flow
import * as ICONS from 'constants/icons';
import * as PAGES from 'constants/pages';
import React, { useEffect, Fragment } from 'react';
import { regexInvalidURI } from 'lbry-redux';
import ClaimPreview from 'component/claimPreview';
import ClaimList from 'component/claimList';
import Page from 'component/page';
import SearchOptions from 'component/searchOptions';
import Button from 'component/button';
import ClaimUri from 'component/claimUri';

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
};

export default function SearchPage(props: Props) {
  const { search, uris, onFeedbackPositive, onFeedbackNegative, location, isSearching, showNsfw } = props;
  const urlParams = new URLSearchParams(location.search);
  const urlQuery = urlParams.get('q') || '';
  const additionalOptions: AdditionalOptions = { isBackgroundSearch: false };
  if (!showNsfw) {
    additionalOptions['nsfw'] = false;
  }

  const INVALID_URI_CHARS = new RegExp(regexInvalidURI, 'gu');
  const modifiedUrlQuery = urlQuery
    .trim()
    .replace(/\s+/g, '-')
    .replace(INVALID_URI_CHARS, '');
  const uriFromQuery = `lbry://${modifiedUrlQuery}`;

  useEffect(() => {
    if (urlQuery) {
      search(urlQuery, additionalOptions);
    }
  }, [search, urlQuery]);

  return (
    <Page>
      <section className="search">
        {urlQuery && (
          <Fragment>
            <header className="search__header">
              <div className="claim-preview__actions--header">
                <ClaimUri uri={uriFromQuery} noShortUrl />
                <Button
                  className="media__uri--right"
                  button="alt"
                  label={__('View top claims for %normalized_uri%', {
                    normalized_uri: uriFromQuery,
                  })}
                  navigate={`/$/${PAGES.TOP}?name=${modifiedUrlQuery}`}
                  icon={ICONS.TOP}
                />
              </div>
              <div className="card">
                <ClaimPreview uri={uriFromQuery} type="large" placeholder="publish" />
              </div>
            </header>

            <ClaimList
              uris={uris}
              loading={isSearching}
              header={<SearchOptions additionalOptions={additionalOptions} />}
              headerAltControls={
                <Fragment>
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
                </Fragment>
              }
            />

            <div className="help">{__('These search results are provided by LBRY, Inc.')}</div>
          </Fragment>
        )}
      </section>
    </Page>
  );
}
