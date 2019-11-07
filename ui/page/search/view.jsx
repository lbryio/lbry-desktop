// @flow
import * as ICONS from 'constants/icons';
import React, { useEffect, Fragment } from 'react';
import { isURIValid, normalizeURI } from 'lbry-redux';
import ClaimPreview from 'component/claimPreview';
import ClaimList from 'component/claimList';
import Page from 'component/page';
import SearchOptions from 'component/searchOptions';
import Button from 'component/button';

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
  const isValid = isURIValid(urlQuery);

  let uri;
  if (isValid) {
    uri = normalizeURI(urlQuery);
  }

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
            {isValid && (
              <header className="search__header">
                <Button button="alt" navigate={uri} className="media__uri--large">
                  {uri}
                </Button>
                <div className="card">
                  <ClaimPreview uri={uri} type="large" placeholder="publish" />
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
