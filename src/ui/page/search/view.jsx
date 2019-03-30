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
import { Location } from '@reach/router';

type Props = { doSearch: string => void, location: UrlLocation };

export default function SearchPage(props: Props) {
  const {
    doSearch,
    location: { search },
  } = props;

  const urlParams = new URLSearchParams(location.search);
  const urlQuery = urlParams.get('q');

  useEffect(() => {
    if (urlQuery) {
      doSearch(urlQuery);
    }
  }, [urlQuery]);

  return (
    <Page noPadding>
      <Location>
        {(locationProps: {
          location: {
            search: string,
          },
        }) => {
          const { location } = locationProps;
          const urlParams = new URLSearchParams(location.search);
          const query = urlParams.get('q');
          const isValid = isURIValid(query);

          let uri;
          let isChannel;
          let label;
          if (isValid) {
            uri = normalizeURI(query);
            ({ isChannel } = parseURI(uri));
            // label = (
            //   <Fragment>
            //     {`lbry://${query}`}
            //     <ToolTip
            //       icon
            //       body={__('This is the resolution of a LBRY URL and not controlled by LBRY Inc.')}
            //     >
            //       <Icon icon={ICONS.HELP} />
            //     </ToolTip>
            //   </Fragment>
            // );
          }

          return (
            <section className="search">
              {query && (
                <Fragment>
                  <header className="search__header">
                    {isValid && (
                      <Fragment>
                        <SearchOptions />

                        <h1 className="media__uri">{uri}</h1>
                        {isChannel ? (
                          <ChannelTile size="large" isSearchResult uri={uri} />
                        ) : (
                          <FileTile size="large" isSearchResult displayHiddenMessage uri={uri} />
                        )}
                      </Fragment>
                    )}
                  </header>

                  <div className="search__results-wrapper">
                    <FileListSearch query={query} />
                    <div className="card__content help">
                      {__('These search results are provided by LBRY, Inc.')}
                    </div>
                  </div>
                </Fragment>
              )}
            </section>
          );
        }}
      </Location>
    </Page>
  );
}
