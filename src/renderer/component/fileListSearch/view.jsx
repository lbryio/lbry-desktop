// @flow
import * as React from 'react';
import { parseURI } from 'lbry-redux';
import FileTile from 'component/fileTile';
import ChannelTile from 'component/channelTile';
import HiddenNsfwClaims from 'component/hiddenNsfwClaims';

const NoResults = () => <div className="file-tile">{__('No results')}</div>;

type Props = {
  query: string,
  isSearching: boolean,
  uris: ?Array<string>,
  downloadUris: ?Array<string>,
};

class FileListSearch extends React.PureComponent<Props> {
  render() {
    const { uris, query, downloadUris, isSearching } = this.props;

    const fileResults = [];
    const channelResults = [];
    if (uris && uris.length) {
      uris.forEach(uri => {
        const isChannel = parseURI(uri).claimName[0] === '@';
        if (isChannel) {
          channelResults.push(uri);
        } else {
          fileResults.push(uri);
        }
      });
    }

    return (
      query && (
        <React.Fragment>
          <div className="search__results">
            <div className="search-result__row">
              <div className="file-list__header">{__('Search Results')}</div>
              <HiddenNsfwClaims uris={uris} />
              {!isSearching && fileResults.length ? (
                fileResults.map(uri => <FileTile key={uri} uri={uri} />)
              ) : (
                <NoResults />
              )}
            </div>

            <div className="search-result__row">
              <div className="file-list__header">{__('Channels')}</div>
              {!isSearching && channelResults.length ? (
                channelResults.map(uri => <ChannelTile key={uri} uri={uri} />)
              ) : (
                <NoResults />
              )}
            </div>

            <div className="search-result__row">
              <div className="file-list__header">{__('Your downloads')}</div>
              {downloadUris && downloadUris.length ? (
                downloadUris.map(uri => <FileTile hideNoResult key={uri} uri={uri} />)
              ) : (
                <NoResults />
              )}
            </div>
          </div>
        </React.Fragment>
      )
    );
  }
}

export default FileListSearch;
