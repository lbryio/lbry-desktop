// @flow
import type { UrlLocation } from 'types/location';
import * as ICONS from 'constants/icons';
import React, { useEffect, Fragment } from 'react';
import { isURIValid, normalizeURI, parseURI } from 'lbry-redux';
import FileTile from 'component/fileTile';
import ChannelTile from 'component/channelTile';
import FileListSearch from 'component/fileListSearch';
import Page from 'component/page';
import ToolTip from 'component/common/tooltip';
import Icon from 'component/common/icon';
import SearchOptions from 'component/searchOptions';
import Button from 'component/button';

type Props = { doSearch: string => void, location: UrlLocation };

export default function SearchPage(props: Props) {
  const {
    doSearch,
    location: { search },
  } = props;
  const urlParams = new URLSearchParams(search);
  const urlQuery = urlParams.get('q');
  const isValid = isURIValid(urlQuery);

  let uri;
  let isChannel;
  let label;
  if (isValid) {
    uri = normalizeURI(urlQuery);
    ({ isChannel } = parseURI(uri));
  }

  useEffect(() => {
    if (urlQuery) {
      doSearch(urlQuery);
    }
  }, [urlQuery]);

  return (
    <Page noPadding>
      <section className="search">
        {urlQuery && (
          <Fragment>
            {isValid && (
              <header className="search__header">
                <Button navigate={uri} className="media__uri">
                  {uri}
                </Button>
                {isChannel ? (
                  <ChannelTile size="large" isSearchResult uri={uri} />
                ) : (
                  <FileTile size="large" isSearchResult displayHiddenMessage uri={uri} />
                )}
              </header>
            )}

            <div className="search__results-wrapper">
              <SearchOptions />

              <FileListSearch query={urlQuery} />
              <div className="card__content help">
                {__('These search results are provided by LBRY, Inc.')}
              </div>
            </div>
          </Fragment>
        )}
      </section>
    </Page>
  );
}
