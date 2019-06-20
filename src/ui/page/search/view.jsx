// @flow
import * as ICONS from 'constants/icons';
import React, { useEffect, Fragment } from 'react';
import { isURIValid, normalizeURI } from 'lbry-redux';
import ClaimListItem from 'component/claimListItem';
import ClaimList from 'component/claimList';
import Page from 'component/page';
import SearchOptions from 'component/searchOptions';
import Button from 'component/button';

type Props = {
  search: string => void,
  location: UrlLocation,
  uris: Array<string>,
  onFeedbackNegative: string => void,
  onFeedbackPositive: string => void,
};

export default function SearchPage(props: Props) {
  const { search, uris, onFeedbackPositive, onFeedbackNegative, location } = props;
  const urlParams = new URLSearchParams(location.search);
  const urlQuery = urlParams.get('q');
  const isValid = isURIValid(urlQuery);

  let uri;
  if (isValid) {
    uri = normalizeURI(urlQuery);
  }

  useEffect(() => {
    if (urlQuery) {
      console.log('search', urlQuery);
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
                <Button button="alt" navigate={uri} className="media__uri">
                  {uri}
                </Button>
                <ClaimListItem uri={uri} type="large" />
              </header>
            )}

            <div className="card">
              <ClaimList
                uris={uris}
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
            <div className="card__content help">{__('These search results are provided by LBRY, Inc.')}</div>
          </Fragment>
        )}
      </section>
    </Page>
  );
}
