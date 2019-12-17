// @flow
import * as ICONS from 'constants/icons';
import React, { useEffect, Fragment } from 'react';
import { isURIValid, normalizeURI, regexInvalidURI } from 'lbry-redux';
import ClaimPreview from 'component/claimPreview';
import ClaimList from 'component/claimList';
import Page from 'component/page';
import SearchOptions from 'component/searchOptions';
import Button from 'component/button';
import ClaimUri from 'component/claimUri';

type Props = {
  search: string => void,
  isSearching: boolean,
  location: UrlLocation,
  uris: Array<string>,
  onFeedbackNegative: string => void,
  onFeedbackPositive: string => void,
};

export default function SearchPage(props: Props) {
  const { search, uris, onFeedbackPositive, onFeedbackNegative, location, isSearching } = props;
  const urlParams = new URLSearchParams(location.search);
  const urlQuery = urlParams.get('q');

  let INVALID_URI_CHARS = new RegExp(regexInvalidURI, 'gu');
  let modifiedUrlQuery = urlQuery
    ? urlQuery
        .trim()
        .replace(/\s+/, '-')
        .replace(INVALID_URI_CHARS, '')
    : '';
  const isModifiedUriValid = isURIValid(modifiedUrlQuery);
  const normalizedModifiedUri = isModifiedUriValid && normalizeURI(modifiedUrlQuery);

  useEffect(() => {
    if (urlQuery) {
      search(urlQuery);
    }
  }, [search, urlQuery]);

  return (
    <Page>
      <section className="search">
        {urlQuery && (
          <Fragment>
            {isModifiedUriValid && (
              <header className="search__header">
                <ClaimUri uri={normalizedModifiedUri} />
                <div className="card">
                  <ClaimPreview uri={normalizedModifiedUri} type="large" placeholder="publish" />
                </div>
              </header>
            )}

            <div className="card">
              <ClaimList
                uris={uris}
                loading={isSearching}
                header={<SearchOptions />}
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
            </div>
            <div className="help">{__('These search results are provided by LBRY, Inc.')}</div>
          </Fragment>
        )}
      </section>
    </Page>
  );
}
